"use server";

import { createClient } from "./server";
import { uploadImageToStorage } from "./storage";
// import supabase from "./client";
import { revalidatePath } from "next/cache";
import supabase from "./client";

export type TagProp = { name: string; icon_url: string };
export type FormState = { success: boolean; message: string } | null;
export type ProjectProp = {
  id: string;
  title: string;
  description_desktop: string;
  desktop_mobile: string;
  image_url: string;
  demo_url: string;
  documentation_url: string;
  prototype_url: string;
  github_url: string;
  tags: TagProp[];
};

export async function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

//initial value is false (for useActionState)
export async function createProject(prevState: FormState, formData: FormData) {
  const supabaseServer = await createClient();

  // DEBUG: Is the server seeing your login?
  const {
    data: { user },
    error: authError,
  } = await supabaseServer.auth.getUser();
  console.log("Server-side user:", user);
  console.log("Auth error:", authError);

  if (!user) {
    return { success: false, message: "Not authenticated on the server!" };
  }

  const title = formData.get("title");
  const description_desktop = formData.get("description_desktop");
  const description_mobile = formData.get("description_mobile");
  const demo_url = formData.get("demo_url");
  const documentation_url = formData.get("documentation_url");
  const prototype_url = formData.get("prototype_url");
  const github_url = formData.get("github_url");
  const tags = formData.getAll("tags") as string[];
  const slug = await slugify(title as string);

  //input upload
  const image_file = formData.get("image_url");

  // Handle missing image file so the function always returns a FormState
  if (!(image_file instanceof File)) {
    return {
      success: false,
      message: "Please select a valid image file.",
    } as FormState;
  }

  // Strictly check the file type
  if (image_file.type !== "image/png") {
    return {
      success: false,
      message: `Error: ${image_file.type} is not a valid file`,
    } as FormState;
  }

  //upload image to storage that returns a image URL to be uploaded in the Database
  const image_url = await uploadImageToStorage(image_file);

  //unpacks the JSON value from the checkbox
  const unpackedTags: TagProp[] = tags.map((t) => JSON.parse(t));

  const { error } = await supabaseServer.from("projects").insert({
    title,
    description_desktop,
    description_mobile,
    image_url: image_url,
    demo_url: demo_url === "" ? null : demo_url,
    documentation_url: documentation_url === "" ? null : documentation_url,
    prototype_url: prototype_url === "" ? null : prototype_url,
    github_url: github_url === "" ? null : github_url,
    tags: unpackedTags,
    slug,
  });

  if (error) {
    return {
      success: false,
      message: `Error: ${error.message}`,
    } as FormState;
  }

  // Clear cache for projects page to show new data immediately
  revalidatePath("/projects");

  return {
    success: true,
    message: `Project: ${title} has been added to the database`,
  } as FormState;
}

export async function getProjects(): Promise<ProjectProp[] | []> {
  const { data, error } = await supabase.from("projects").select("*");

  if (error) {
    throw new Error(`Error: ${error.message}`);
  }

  return (data as ProjectProp[]) || [];
}
