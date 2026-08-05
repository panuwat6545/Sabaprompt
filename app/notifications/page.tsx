import React from "react";
import { getSession } from "../../lib/session";
import { createAdminClient } from "../../lib/supabase-admin";
import NotificationsClient, { NotificationItem } from "../../components/NotificationsClient";
import NotificationsLoggedOut from "../../components/NotificationsLoggedOut";

export const revalidate = 0; // Fetch fresh notifications on every request

export default async function NotificationsPage() {
  const session = await getSession();

  if (!session) {
    return <NotificationsLoggedOut />;
  }

  const supabase = createAdminClient();

  // Query notifications for the active user
  const { data: notificationsData, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("recipient_line_user_id", session.line_user_id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching notifications:", error);
  }

  const notifications = notificationsData || [];

  return (
    <NotificationsClient notifications={notifications as unknown as NotificationItem[]} />
  );
}
