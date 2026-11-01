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

const blogTable: string = "blogs";

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
    .from(blogTable)
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

export async function getBlogById(id: number): Promise<BlogProp> {
  const supabaseServer = await createClient();

  const { data, error } = await supabaseServer
    .from(blogTable)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Error: unable to fetch blog - ${error.message}`);
  }

  return data as BlogProp;
}

export async function updateBlog(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabaseServer = await createClient();

  const id = formData.get("id");
  const title = formData.get("title");
  const context = formData.get("context");
  const excerpt = formData.get("excerpt");
  const slug = await slugify(title as string);
  const user = await getAuthUser();

  const { error } = await supabaseServer
    .from(blogTable)
    .update({ title, context, excerpt, slug, user_id: user.uid })
    .eq("id", id);

  if (error) {
    return {
      success: false,
      message: `Failed to update blog : ${error.message}`,
    } as FormState;
  }

  return {
    success: true,
    message: `Blog has been updated successfully`,
  } as FormState;
}
