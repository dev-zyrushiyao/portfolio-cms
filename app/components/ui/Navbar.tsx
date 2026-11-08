import React, { useEffect, useState } from "react";

import { MdLogout } from "react-icons/md";
import Image from "next/image";
import { useRouter } from "next/navigation";
import supabase from "../../services/supabase/client";
import Link from "next/link";

import { User } from "@supabase/supabase-js";
import supabaseClient from "../../services/supabase/client";

export default function Navbar() {
  const router = useRouter();

  const [loggedUser, setLoggedUser] = useState<User | null>(null);

  useEffect(() => {
    async function getLoggedUser() {
      const {
        data: { user },
        error,
      } = await supabaseClient.auth.getUser();

      if (!user || error) {
        router.push("/");
      }

      setLoggedUser(user);
    }

    getLoggedUser();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut({ scope: "local" });
    router.push("/");
  }

  return (
    <nav className="flex flex-row justify-between items-center rounded-2xl bg-red-500 p-5 text-white">
      <Link href={"/dashboard"}>
        <h5>ZH Content Management System</h5>
      </Link>

      <div>
        <div className="flex flex-row gap-3 items-center">
          {loggedUser?.user_metadata.avatar_url && (
            <div className="rounded-full overflow-clip">
              <Image
                src={loggedUser.user_metadata.avatar_url}
                alt="google-photo"
                width={50}
                height={50}
              />
            </div>
          )}
          <h6 className="text-xl">{loggedUser?.user_metadata.name}</h6>
          <button
            className="border p-4 rounded-sm flex flex-row justify-center items-center gap-3 bg-amber-200 cursor-pointer text-black"
            type="button"
            onClick={handleLogout}
          >
            <div className="logo-wrapper">{<MdLogout />}</div>
            <span className="font-bold">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
