"use client";

import { useEffect } from "react";
import supabase from "@/app/services/client";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      // 1. Check if Supabase sent an error back in the URL (search or hash)
      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(
        window.location.hash.replace("#", "?"),
      );
      const code = searchParams.get("code");

      const errorCode = searchParams.get("error") || hashParams.get("error");

      if (errorCode) {
        const targetUrl = `${window.location.origin}/?error=${errorCode}`;
        if (window.opener) {
          window.opener.location.href = targetUrl;
          window.close();
        } else {
          router.push(`/?error=${errorCode}`);
        }
        return;
      }

      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      }

      // 2. Otherwise, handle normal session parsing
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        const targetUrl = `${window.location.origin}/dashboard`;

        if (session) {
          const userEmail = session.user.email;
          const allowedEmail = "zyrushiyao@gmail.com";

          if (userEmail !== allowedEmail) {
            await supabase.auth.signOut();
            const unauthorizedUrl = `${window.location.origin}/?error=unauthorized`;
            if (window.opener) {
              window.opener.location.href = unauthorizedUrl;
              window.close();
            } else {
              router.push("/?error=unauthorized");
            }
            return;
          }

          if (window.opener) {
            window.opener.location.href = targetUrl;
            window.close();
          } else {
            router.push("/dashboard");
          }
        }
      });
    }

    handleCallback();
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center font-sans">
      <div className="text-center">
        <p className="text-gray-600 font-medium">Completing sign in...</p>
      </div>
    </div>
  );
}
