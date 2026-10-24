"use client";

import { useEffect } from "react";
import supabase from "@/app/services/supabase";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Supabase client automatically parses the hash fragment (#access_token=...)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const targetUrl = `${window.location.origin}/dashboard`;

      if (session) {
        const userEmail = session.user.email;
        const allowedEmail = "zyrushiyao@gmail.com";

        // If it's not you, sign them out immediately
        if (userEmail !== allowedEmail) {
          await supabase.auth.signOut();
          const targetUrl = `${window.location.origin}/?error=unauthorized`;
          if (window.opener) {
            window.opener.location.href = targetUrl;
            window.close();
          } else {
            router.push("/?error=unauthorized");
          }
          return;
        }
        if (window.opener) {
          // Send success event to parent window and close popup
          window.opener.location.href = targetUrl;
          window.close();
        } else {
          // If loaded in main window instead of popup, redirect home
          //   window.location.href = "/";
          router.push("/dashboard");
        }
      }
    });
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center font-sans">
      <div className="text-center">
        <p className="text-gray-600 font-medium">Completing sign in...</p>
      </div>
    </div>
  );
}
