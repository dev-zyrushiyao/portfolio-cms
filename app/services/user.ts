
import { createClient } from "./supabase/server";

export interface UserProp {
  uid: string;
  name: string;
}

export async function getAuthUser(): Promise<UserProp> {
  const supabaseServer = await createClient();

  const {
    data: { user: authUser },
    error: authError,
  } = await supabaseServer.auth.getUser();

  if (authError || !authUser) {
    throw new Error("Unauthorized");
  }

  return {
    uid: authUser.id,
    name: authUser.user_metadata?.full_name || authUser.email || "User",
  } as UserProp;
}
