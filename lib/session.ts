import { cookies } from "next/headers";
import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";

// Compute secure 256-bit key from the SESSION_SECRET environment variable
const getSecretKey = () => {
  const secret = process.env.SESSION_SECRET || "default-session-secret-must-be-at-least-32-chars-long";
  return crypto.createHash("sha256").update(secret).digest();
};

export interface SessionData {
  line_user_id: string;
  display_name: string;
  avatar_url: string;
  status_message?: string;
}

// Encrypt payload into ciphertext
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const key = getSecretKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

// Decrypt ciphertext back to cleartext
export function decrypt(text: string): string | null {
  try {
    const parts = text.split(":");
    const ivHex = parts[0];
    const encryptedText = parts[1];
    if (!ivHex || !encryptedText) return null;
    const iv = Buffer.from(ivHex, "hex");
    const key = getSecretKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    return null;
  }
}

// Read and verify HttpOnly cookie session
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("saba_session");
  if (!sessionCookie) return null;

  const decrypted = decrypt(sessionCookie.value);
  if (!decrypted) return null;

  try {
    return JSON.parse(decrypted) as SessionData;
  } catch (e) {
    return null;
  }
}

// Write secure HttpOnly cookie session
export async function setSession(data: SessionData) {
  const cookieStore = await cookies();
  const payload = JSON.stringify(data);
  const encrypted = encrypt(payload);

  cookieStore.set("saba_session", encrypted, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
}

// Clear cookie session on logout
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set("saba_session", "", {
    path: "/",
    maxAge: -1,
  });
}
