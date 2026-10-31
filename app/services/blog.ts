"use server";

import { createClient } from "./supabase/server";
import { getAuthUser } from "./user";
import { slugify } from "./utils";
export type FormState = { success: boolean; message: string } | null;

export interface BlogProp {
  id: number;
  title: string;
  context: string;
  slug: string;
  excerpt: string;
  user_id: string;
  updated_at: string;
  created_at: string;
}

const blogTable: string = "blog";

export async function postBlog(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabaseServer = await createClient();

  const title = formData.get("title");
  const context = formData.get("context");
  const excerpt = formData.get("excerpt");
  const slug = await slugify(title as string);
  const user = await getAuthUser();

  const { error } = await supabaseServer
    .from("blog")
    .insert({ title, context, excerpt, slug, user_id: user.uid });

  if (error) {
    return {
      success: false,
      message: `Failed to post blog : ${error.message}`,
    } as FormState;
  }

  return {
    success: true,
    message: `Blog: "${title}" has been added to the database`,
  } as FormState;
}

export async function getAllBlogs(): Promise<BlogProp[]> {
  const supabaseServer = await createClient();

  const { data, error } = await supabaseServer.from(blogTable).select("*");

  if (error) {
    throw new Error(`Data not found: ${error.message}`);
  }

  return data as BlogProp[];
}

export async function deleteBlog(id: number): Promise<void> {
  const supabaseServer = await createClient();

  const { error } = await supabaseServer.from(blogTable).delete().eq("id", id);

  if (error) {
    throw new Error(`Error: unable to delete blog - ${error.message}`);
  }
}
