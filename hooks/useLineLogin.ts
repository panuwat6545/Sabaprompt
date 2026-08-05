'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface LineUser {
  name: string;
  picture: string;
  status?: string;
}

export function useLineLogin() {
  const [user, setUser] = useState<LineUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkSession = async () => {
    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = await res.json();
        if (data.loggedIn) {
          setUser({
            name: data.name,
            picture: data.avatar_url,
            status: data.status,
          });
        } else {
          setUser(null);
        }
      }
    } catch (e) {
      console.error("Failed to fetch session:", e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok && !cancelled) {
          const data = await res.json();
          if (data.loggedIn) {
            setUser({
              name: data.name,
              picture: data.avatar_url,
              status: data.status,
            });
          } else {
            setUser(null);
          }
        }
      } catch (e) {
        console.error("Failed to fetch session:", e);
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = () => {
    if (typeof window === "undefined") return;

    // Use current NEXT_PUBLIC_LINE_CHANNEL_ID or default
    const channelId = process.env.NEXT_PUBLIC_LINE_CHANNEL_ID || "2010930514";
    
    // Construct callback URI
    const redirectUri = encodeURIComponent(window.location.origin + "/api/callback");
    const state = Math.random().toString(36).substring(2, 15);

    // Optional state verification save
    localStorage.setItem("line_login_state", state);

    const authUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${channelId}&redirect_uri=${redirectUri}&state=${state}&scope=profile%20openid`;
    window.location.href = authUrl;
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Failed to logout:", e);
    }
    setUser(null);
    router.refresh();
  };

  return { user, loading, login, logout, refreshSession: checkSession };
}
