"use client";

import { Auth } from "@supabase/auth-ui-react";
import Logo from "./components/svg/Logo";
import { handleGoogleLogin } from "./auth/auth";
import supabase from "./services/supabase";
import { FcGoogle } from "react-icons/fc";

export default function Home() {
  return (
    <div>
      <div className="wrapper flex flex-row">
        <div className="bg-red-500 w-full h-dvh flex flex-col justify-center items-center">
          <Logo />
        </div>
        <div className="bg-green-400 w-1/2 flex flex-col justify-center items-center gap-10">
          <h5>Zyrus Hiyao Portfolio CMS</h5>
          <button
            className="border p-3 bg-white rounded-sm cursor-pointer"
            type="button"
            onClick={handleGoogleLogin}
          >
            <div className="flex flex-row gap-2 justify-center items-center">
              <FcGoogle className="text-2xl" />
              <span className="text-base font-sans font-semibold">
                Login with Google
              </span>
            </div>
          </button>
          {/* <Auth supabaseClient={supabase} /> */}
        </div>
      </div>
    </div>
  );
}
