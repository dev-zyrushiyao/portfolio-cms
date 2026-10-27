"use server";

import { createClient } from "./server";

export interface TechstackProp {
  fileName: string;
  originalName: string;
  url: string;
}

//fetch techstack
export async function getStorageImage() {
  const supabaseServer = await createClient();
  //Select Storage bucket
  //Create new policy - from the scratch
  //Allowed Operation: Select
  //Save new policy
  const { data: files, error } = await supabaseServer.storage
    .from("techstack-image")
    .list();

  if (error) {
    console.error("Error listing files:", error.message);
    return [];
  }

  const fileData = files.map((file) => {
    const { data } = supabaseServer.storage
      .from("techstack-image")
      .getPublicUrl(file.name);

    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf("."));

    return {
      fileName: nameWithoutExt,
      originalName: file.name,
      url: data.publicUrl,
    } as TechstackProp;
  });

  return fileData;
}

//upload to project-images
export async function uploadImageToStorage(file: File) {
  const supabaseServer = await createClient();

  //saves policy storage insert
  //allow authenticated users only
  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabaseServer.storage
    .from("project-images")
    .upload(fileName, file);

  if (error) {
    console.error("Error uploading image:", error.message);
    throw new Error(`Error uploading image ${error.message}`);
  }

  const { data: fileData } = await supabaseServer.storage
    .from("project-images")
    .getPublicUrl(fileName);

  console.log("URL", fileData.publicUrl);

  return fileData.publicUrl;
}
