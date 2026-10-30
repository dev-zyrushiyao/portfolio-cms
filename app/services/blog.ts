"use server";

import { createClient } from "./supabase/server";
import { getAuthUser } from "./user";
import { slugify } from "./utils";

export async function postBlog(formData: FormData) {
  const supabaseServer = await createClient();

  const title = formData.get("title");
  const context = formData.get("context");
  const excerpt = formData.get("excerpt");
  const slug = await slugify(title as string);

  const user = await getAuthUser();

  const { data, error } = await supabaseServer
    .from("blog")
    .insert({ title, context, excerpt, slug, user_id: user.uid });
}
