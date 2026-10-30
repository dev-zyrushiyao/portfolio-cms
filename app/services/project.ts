"use server";

import { createClient } from "./supabase/server";
import { uploadProjectImageToStorage } from "./storage";
// import supabase from "./client";
import { revalidatePath } from "next/cache";
import supabase from "./supabase/client";
import { slugify } from "./utils";

export type TagProp = { name: string; icon_url: string };
export type FormState = { success: boolean; message: string } | null; //state is return value from function and used by useActionState of form via Sonner Toast
export type ProjectProp = {
  id: string;
  title: string;
  description_desktop: string;
  description_mobile: string;
  image_url: string;
  demo_url: string;
  documentation_url: string;
  prototype_url: string;
  github_url: string;
  tags: TagProp[];
  slug: string;
};

//initial value is false (for useActionState)
export async function createProject(prevState: FormState, formData: FormData) {
  const supabaseServer = await createClient();

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
  const image_url = await uploadProjectImageToStorage(image_file);

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
    updated_at: null,
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

export async function getAllProjects(): Promise<ProjectProp[] | []> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(`Error: ${error.message}`);
  }

  return (data as ProjectProp[]) || [];
}

export async function getProjectById(id: string): Promise<ProjectProp> {
  const supabaseServer = await createClient();
  const { data, error } = await supabaseServer
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Error: ${error.message}`);
  }

  return data as ProjectProp;
}

export async function updateProject(prevState: FormState, formData: FormData) {
  const supabaseServer = await createClient();

  const id = formData.get("id"); // hidden
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
  const image_file = formData.get("image_url") as File | null;

  //fetch image url from ID
  const { data: existingProject, error: fetchError } = await supabaseServer
    .from("projects")
    .select("image_url")
    .eq("id", id)
    .single();

  if (fetchError) {
    return {
      success: false,
      message: `Error finding project: ${fetchError.message}`,
    };
  }

  let image_url = existingProject.image_url;

  // Handle missing image file so the function always returns a FormState
  if (!(image_file instanceof File)) {
    return {
      success: false,
      message: "Please select a valid image file.",
    } as FormState;
  }
  // Strictly check the file type - if there is any uploaded file from the form
  if (image_file && image_file.size > 0) {
    if (image_file.type !== "image/png") {
      return {
        success: false,
        message: `Error: ${image_file.type} is not a valid file`,
      } as FormState;
    }
    //upload image to storage that returns a image URL to be uploaded in the Database
    image_url = await uploadProjectImageToStorage(image_file);
  }

  //unpacks the JSON value from the checkbox
  const unpackedTags: TagProp[] = tags.map((t) => JSON.parse(t));

  const { error } = await supabaseServer
    .from("projects")
    .update({
      title,
      description_desktop,
      description_mobile,
      image_url: image_url,
      demo_url: demo_url === "" ? null : demo_url,
      documentation_url: documentation_url === "" ? null : documentation_url,
      prototype_url: prototype_url === "" ? null : prototype_url,
      github_url: github_url === "" ? null : github_url,
      tags: unpackedTags,
      updated_at: new Date().toISOString(),
      slug,
    })
    .eq("id", id)
    .maybeSingle();

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

export async function searchProjectByTitle(
  title: string,
): Promise<ProjectProp | null> {
  const supabaseServer = await createClient();

  const { data, error } = await supabaseServer
    .from("projects")
    .select("*")
    .eq("title", title)
    .single();

  if (error) {
    throw new Error(`Error: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return data;
}
