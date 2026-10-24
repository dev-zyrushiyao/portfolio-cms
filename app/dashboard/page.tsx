"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/app/services/supabase";
import { MdLogout } from "react-icons/md";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (!user || error) {
        // Redirect back to home/login if not authenticated
        router.push("/");
      } else {
        setLoading(false);
      }
    });
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center font-sans">
        <p className="text-gray-600 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  async function handleLogout() {
    await supabase.auth.signOut({ scope: "local" });
    router.push("/");
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
      <button
        className="border p-4 rounded-sm flex flex-row justify-center items-center gap-3 bg-amber-200 cursor-pointer"
        type="button"
        onClick={handleLogout}
      >
        <div className="logo-wrapper">{<MdLogout />}</div>
        <span className="font-bold">Logout</span>
      </button>
    </div>
  );
}
