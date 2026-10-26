"use server";

import { uploadImageToStorage } from "./storage";
import supabase from "./supabase";

export type TagProp = { name: string; icon_url: string };

export async function addProject(formData: FormData) {
  const title = formData.get("title");
  const description_desktop = formData.get("description_desktop");
  const description_mobile = formData.get("description_mobile");
  const demo_url = formData.get("demo_url");
  const documentation_url = formData.get("documentation_url");
  const prototype_url = formData.get("prototype_url");
  const github_url = formData.get("github_url");
  const tags = formData.getAll("tags") as string[];

  //input upload
  const image_file = formData.get("image_url");

  if (image_file instanceof File) {
    const image_url = await uploadImageToStorage(image_file);

    tags.forEach((elem) => {
      console.log("elem ", elem);
    });

    const unpackedTags: TagProp[] = tags.map((t) => JSON.parse(t));

    const { error } = await supabase.from("projects").insert({
      title,
      description_desktop,
      description_mobile,
      image_url: image_url,
      demo_url: demo_url === "" ? null : demo_url,
      documentation_url: documentation_url === "" ? null : documentation_url,
      prototype_url: prototype_url === "" ? null : prototype_url,
      github_url: github_url === "" ? null : github_url,
      tags: unpackedTags,
    });

    if (error) {
      throw new Error(`Failed to save project ${error.message}`);
    }
  } else {
    console.log("No file received");
  }
}
