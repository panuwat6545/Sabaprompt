'use server';

import { revalidatePath } from "next/cache";
import { getSession } from "../lib/session";
import { createAdminClient } from "../lib/supabase-admin";
import crypto from "crypto";

/**
 * Server Action: Create a new post / thread
 * Returns a structured result object: { success: boolean, error?: string, postId?: string }
 */
export async function createPost(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized: Please link your LINE account first." };
    }

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const categoryIdStr = formData.get("category_id") as string;

    if (!title || !title.trim()) {
      return { success: false, error: "Missing title field." };
    }
    if (!content || !content.trim()) {
      return { success: false, error: "Missing content field." };
    }
    if (!categoryIdStr) {
      return { success: false, error: "Missing category field." };
    }

    const categoryId = parseInt(categoryIdStr, 10);
    const supabase = createAdminClient();

    let finalImageUrl: string | null = null;
    const imageFile = formData.get("image") as File | null;

    // Process server-side image upload if provided
    if (imageFile && imageFile.size > 0) {
      // 1. Server-side validation: MIME type check
      if (!imageFile.type || !imageFile.type.startsWith("image/")) {
        return { success: false, error: "ไฟล์ที่แนบต้องเป็นรูปภาพเท่านั้น" };
      }

      // 2. Server-side validation: File size check (max 5MB)
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      if (imageFile.size > MAX_SIZE) {
        return { success: false, error: "ขนาดไฟล์ต้องไม่เกิน 5MB" };
      }

      try {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const fileExt = imageFile.name.split(".").pop() || "jpg";
        const uniqueFileName = `${crypto.randomUUID()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("thread-images")
          .upload(uniqueFileName, buffer, {
            contentType: imageFile.type || "image/jpeg",
          });

        if (uploadError) {
          return { success: false, error: `Supabase Storage upload failed: ${uploadError.message}` };
        }

        // Get public URL
        const { data } = supabase.storage
          .from("thread-images")
          .getPublicUrl(uniqueFileName);

        finalImageUrl = data.publicUrl;
      } catch (uploadErr: any) {
        console.error("Storage upload error:", uploadErr);
        return { success: false, error: `ไม่สามารถอัปโหลดรูปภาพได้: ${uploadErr.message}` };
      }
    }

    const { data: newPost, error } = await supabase
      .from("posts")
      .insert({
        title: title.trim(),
        content: content.trim(),
        image_url: finalImageUrl,
        category_id: categoryId,
        author_name: session.display_name,
        author_avatar: session.avatar_url,
        line_user_id: session.line_user_id,
        likes_count: 0,
      })
      .select("id")
      .single();

    if (error) {
      return { success: false, error: `Failed to create post in database: ${error.message}` };
    }

    revalidatePath("/");
    return { success: true, postId: newPost.id };
  } catch (err: any) {
    console.error("createPost error:", err);
    return { success: false, error: err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อระบบ" };
  }
}

/**
 * Server Action: Create a new comment / nested reply
 * Returns a structured result: { success: boolean, error?: string, comment?: any }
 */
export async function createComment(postId: string, content: string, parentId: string | null = null) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized: Please link your LINE account first." };
    }

    if (!content || !content.trim()) {
      return { success: false, error: "Comment content cannot be empty." };
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        parent_id: parentId,
        content: content.trim(),
        author_name: session.display_name,
        author_avatar: session.avatar_url,
        line_user_id: session.line_user_id,
        likes_count: 0,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: `Failed to create comment: ${error.message}` };
    }

    // --- NOTIFICATION CREATION START ---
    try {
      if (!parentId) {
        // Top-level comment: Fetch the post's line_user_id
        const { data: post } = await supabase
          .from("posts")
          .select("line_user_id")
          .eq("id", postId)
          .single();
        
        if (post && post.line_user_id && post.line_user_id !== session.line_user_id) {
          await supabase.from("notifications").insert({
            recipient_line_user_id: post.line_user_id,
            type: "comment",
            actor_name: session.display_name,
            post_id: postId,
            comment_id: data.id,
            message: `${session.display_name} แสดงความคิดเห็นในกระทู้ของคุณ`,
          });
        }
      } else {
        // Reply: Fetch the parent comment's line_user_id
        const { data: parentComment } = await supabase
          .from("comments")
          .select("line_user_id")
          .eq("id", parentId)
          .single();
        
        if (parentComment && parentComment.line_user_id && parentComment.line_user_id !== session.line_user_id) {
          await supabase.from("notifications").insert({
            recipient_line_user_id: parentComment.line_user_id,
            type: "reply",
            actor_name: session.display_name,
            post_id: postId,
            comment_id: data.id,
            message: `${session.display_name} ตอบกลับความคิดเห็นของคุณ`,
          });
        }
      }
    } catch (notifErr) {
      console.error("Failed to create comment/reply notification:", notifErr);
    }
    // --- NOTIFICATION CREATION END ---

    revalidatePath(`/thread/${postId}`);
    return { success: true, comment: data };
  } catch (err: any) {
    console.error("createComment error:", err);
    return { success: false, error: err.message || "เกิดข้อผิดพลาดในการแสดงความคิดเห็น" };
  }
}

/**
 * Server Action: Toggle like on a post
 * Returns a structured result: { success: boolean, error?: string, liked?: boolean }
 */
export async function toggleLike(postId: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized: Please link your LINE account first." };
    }

    const supabase = createAdminClient();

    // 1. Check if the like record already exists
    const { data: existingLike, error: checkError } = await supabase
      .from("post_likes")
      .select("*")
      .eq("post_id", postId)
      .eq("line_user_id", session.line_user_id)
      .maybeSingle();

    if (checkError) {
      return { success: false, error: `Failed to check likes status: ${checkError.message}` };
    }

    // Read current post details
    const { data: post, error: readError } = await supabase
      .from("posts")
      .select("likes_count")
      .eq("id", postId)
      .single();

    if (readError || !post) {
      return { success: false, error: "Post not found." };
    }

    const currentLikes = post.likes_count || 0;
    let newLikedState = false;

    if (existingLike) {
      // 2. Unlike path: Delete the like row
      const { error: deleteError } = await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("line_user_id", session.line_user_id);

      if (deleteError) {
        return { success: false, error: `Failed to remove like: ${deleteError.message}` };
      }

      // Decrement the likes count (min 0)
      const newLikesCount = Math.max(0, currentLikes - 1);
      const { error: updateError } = await supabase
        .from("posts")
        .update({ likes_count: newLikesCount })
        .eq("id", postId);

      if (updateError) {
        return { success: false, error: `Failed to update likes count: ${updateError.message}` };
      }

      newLikedState = false;
    } else {
      // 3. Like path: Insert the like row
      const { error: insertError } = await supabase
        .from("post_likes")
        .insert({
          post_id: postId,
          line_user_id: session.line_user_id,
        });

      if (insertError) {
        return { success: false, error: `Failed to record like: ${insertError.message}` };
      }

      // Increment the likes count
      const newLikesCount = currentLikes + 1;
      const { error: updateError } = await supabase
        .from("posts")
        .update({ likes_count: newLikesCount })
        .eq("id", postId);

      if (updateError) {
        return { success: false, error: `Failed to update likes count: ${updateError.message}` };
      }

      newLikedState = true;

      // --- NOTIFICATION FOR POST LIKE START ---
      try {
        const { data: postData } = await supabase
          .from("posts")
          .select("line_user_id")
          .eq("id", postId)
          .single();

        if (postData && postData.line_user_id && postData.line_user_id !== session.line_user_id) {
          await supabase.from("notifications").insert({
            recipient_line_user_id: postData.line_user_id,
            type: "post_like",
            actor_name: session.display_name,
            post_id: postId,
            message: `${session.display_name} ถูกใจกระทู้ของคุณ`,
          });
        }
      } catch (notifErr) {
        console.error("Failed to create post_like notification:", notifErr);
      }
      // --- NOTIFICATION FOR POST LIKE END ---
    }

    // Call revalidate path in both paths
    revalidatePath("/");
    revalidatePath(`/thread/${postId}`);

    return { success: true, liked: newLikedState };
  } catch (err: any) {
    console.error("toggleLike error:", err);
    return { success: false, error: err.message || "เกิดข้อผิดพลาดในการปรับเปลี่ยนสถานะถูกใจ" };
  }
}

/**
 * Server Action: Toggle like on a comment / reply
 * Returns a structured result: { success: boolean, error?: string, liked?: boolean }
 */
export async function toggleCommentLike(commentId: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized: Please link your LINE account first." };
    }

    const supabase = createAdminClient();

    // 1. Check if the like record already exists in comment_likes
    const { data: existingLike, error: checkError } = await supabase
      .from("comment_likes")
      .select("*")
      .eq("comment_id", commentId)
      .eq("line_user_id", session.line_user_id)
      .maybeSingle();

    if (checkError) {
      return { success: false, error: `Failed to check comment likes status: ${checkError.message}` };
    }

    // Read current comment details
    const { data: comment, error: readError } = await supabase
      .from("comments")
      .select("likes_count, post_id, line_user_id")
      .eq("id", commentId)
      .single();

    if (readError || !comment) {
      return { success: false, error: "Comment not found." };
    }

    const currentLikes = comment.likes_count || 0;
    let newLikedState = false;

    if (existingLike) {
      // 2. Unlike path: Delete the comment like row
      const { error: deleteError } = await supabase
        .from("comment_likes")
        .delete()
        .eq("comment_id", commentId)
        .eq("line_user_id", session.line_user_id);

      if (deleteError) {
        return { success: false, error: `Failed to remove comment like: ${deleteError.message}` };
      }

      // Decrement the likes count (min 0)
      const newLikesCount = Math.max(0, currentLikes - 1);
      const { error: updateError } = await supabase
        .from("comments")
        .update({ likes_count: newLikesCount })
        .eq("id", commentId);

      if (updateError) {
        return { success: false, error: `Failed to update comment likes count: ${updateError.message}` };
      }

      newLikedState = false;
    } else {
      // 3. Like path: Insert the comment like row
      const { error: insertError } = await supabase
        .from("comment_likes")
        .insert({
          comment_id: commentId,
          line_user_id: session.line_user_id,
        });

      if (insertError) {
        return { success: false, error: `Failed to record comment like: ${insertError.message}` };
      }

      // Increment the likes count
      const newLikesCount = currentLikes + 1;
      const { error: updateError } = await supabase
        .from("comments")
        .update({ likes_count: newLikesCount })
        .eq("id", commentId);

      if (updateError) {
        return { success: false, error: `Failed to update comment likes count: ${updateError.message}` };
      }

      newLikedState = true;

      // --- NOTIFICATION FOR COMMENT LIKE START ---
      try {
        if (comment && comment.line_user_id && comment.line_user_id !== session.line_user_id) {
          await supabase.from("notifications").insert({
            recipient_line_user_id: comment.line_user_id,
            type: "comment_like",
            actor_name: session.display_name,
            post_id: comment.post_id,
            comment_id: commentId,
            message: `${session.display_name} ถูกใจความคิดเห็นของคุณ`,
          });
        }
      } catch (notifErr) {
        console.error("Failed to create comment_like notification:", notifErr);
      }
      // --- NOTIFICATION FOR COMMENT LIKE END ---
    }

    revalidatePath(`/thread/${comment.post_id}`);

    return { success: true, liked: newLikedState };
  } catch (err: any) {
    console.error("toggleCommentLike error:", err);
    return { success: false, error: err.message || "เกิดข้อผิดพลาดในการปรับเปลี่ยนสถานะถูกใจคอมเมนต์" };
  }
}

/**
 * Server Action: Mark a single notification as read
 */
export async function markNotificationRead(id: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized." };
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id)
      .eq("recipient_line_user_id", session.line_user_id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/notifications");
    return { success: true };
  } catch (err: any) {
    console.error("markNotificationRead error:", err);
    return { success: false, error: err.message || "Failed to mark notification as read." };
  }
}

/**
 * Server Action: Mark all unread notifications of the user as read
 */
export async function markAllNotificationsRead() {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized." };
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("recipient_line_user_id", session.line_user_id)
      .eq("is_read", false);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/notifications");
    return { success: true };
  } catch (err: any) {
    console.error("markAllNotificationsRead error:", err);
    return { success: false, error: err.message || "Failed to mark all notifications as read." };
  }
}

/**
 * Server Action: Get the count of unread notifications for the active user
 */
export async function getUnreadNotificationCount() {
  try {
    const session = await getSession();
    if (!session) {
      return 0;
    }

    const supabase = createAdminClient();
    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("recipient_line_user_id", session.line_user_id)
      .eq("is_read", false);

    if (error) {
      console.error("getUnreadNotificationCount DB error:", error);
      return 0;
    }

    return count || 0;
  } catch (err: any) {
    if (err.digest === 'DYNAMIC_SERVER_USAGE' || (err.message && err.message.includes('Dynamic server usage'))) {
      throw err;
    }
    console.error("getUnreadNotificationCount error:", err);
    return 0;
  }
}

/**
 * Server Action: Get search suggestions matching titles from posts and articles
 */
export async function getSearchSuggestions(query: string) {
  try {
    if (!query || !query.trim()) {
      return [];
    }

    const supabase = createAdminClient();
    const cleanQuery = query.trim();

    // Query matching posts and articles in parallel
    const [postsRes, articlesRes] = await Promise.all([
      supabase
        .from("posts")
        .select("title")
        .ilike("title", `%${cleanQuery}%`)
        .limit(5),
      supabase
        .from("articles")
        .select("title")
        .ilike("title", `%${cleanQuery}%`)
        .limit(5),
    ]);

    const suggestionsSet = new Set<string>();

    if (postsRes.data) {
      postsRes.data.forEach(p => {
        if (p.title) suggestionsSet.add(p.title.trim());
      });
    }

    if (articlesRes.data) {
      articlesRes.data.forEach(a => {
        if (a.title) suggestionsSet.add(a.title.trim());
      });
    }

    // Limit to maximum 6 unique suggestions
    return Array.from(suggestionsSet).slice(0, 6);
  } catch (err) {
    console.error("getSearchSuggestions error:", err);
    return [];
  }
}
