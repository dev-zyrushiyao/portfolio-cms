"use server";

import { createClient } from "./supabase/server";
import { v4 as uuidv4 } from "uuid";

export interface TechstackProp {
  fileName: string;
  originalName: string;
  url: string;
}

const storageBucket = { personalFile: "personal-file" };

//fetch techstack info and put it on checkbox
export async function getStorageTechstackImageInfo() {
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
export async function uploadProjectImageToStorage(file: File) {
  const supabaseServer = await createClient();
  const projectImages: string = "project-images";

  //file type checker - only accept png
  if (file.type !== "image/png") {
    throw new Error("Unsupported file type");
  }

  //file size maximum checker
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image must not exceed 10 MB.");
  }

  //file size mininum checker
  if (file.size === 0) {
    throw new Error("The uploaded file is empty.");
  }

  //saves policy storage insert
  //allow authenticated users only
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-");
  const fileName = `${uuidv4()}-${sanitizedName}`;

  const { error } = await supabaseServer.storage
    .from(projectImages)
    .upload(fileName, file);

  if (error) {
    console.error("Error uploading image:", error.message);
    throw new Error(`Error uploading image ${error.message}`);
  }

  const { data: fileData } = await supabaseServer.storage
    .from(projectImages)
    .getPublicUrl(fileName);

  console.log("URL", fileData.publicUrl);

  return fileData.publicUrl;
}

export async function deleteProjectImageFromStorage(filePath: string) {
  const supabaseServer = await createClient();

  const { error } = await supabaseServer.storage
    .from("project-images")
    .remove([filePath]);

  if (error) {
    //failed to delete a project image from storage
    throw new Error(`Error: ${error.message}`);
  }
}

export async function uploadBlogMediaToStorage(file: File) {
  const supabaseServer = await createClient();
  const blogImages: string = "blog-images";

  const allowedTypes = ["image/png", "image/jpg", "image/webp"];

  //file type checker - accepts png and mp4
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Unsupported media format");
  }

  //file size maximum checker
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image must not exceed 10 MB.");
  }

  //file size mininum checker
  if (file.size === 0) {
    throw new Error("The uploaded file is empty.");
  }

  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-");
  const fileName = `${uuidv4()}-${sanitizedName}`;

  const { error } = await supabaseServer.storage
    .from(blogImages)
    .upload(fileName, file);

  if (error) {
    console.error("Error uploading image:", error.message);
    throw new Error(`Error uploading image ${error.message}`);
  }

  const { data: fileData } = await supabaseServer.storage
    .from(blogImages)
    .getPublicUrl(fileName);

  console.log("URL", fileData.publicUrl);

  return fileData.publicUrl;
}

export async function uploadPublicFilesToStorage(file: File) {
  const supabaseServer = await createClient();

  const personalFileTypes = [
    "image/png",
    "image/jpeg",
    "application/pdf",
    "image/svg+xml",
  ];

  //file type checker
  if (!personalFileTypes.includes(file.type)) {
    throw new Error("Unsupported media format");
  }

  //file size maximum checker
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("file must not exceed 10 MB.");
  }

  //file size mininum checker
  if (file.size === 0) {
    throw new Error("The uploaded file is empty.");
  }

  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-");
  const fileName = `${uuidv4()}-${sanitizedName}`;

  const { error } = await supabaseServer.storage
    .from(storageBucket.personalFile)
    .upload(fileName, file);

  if (error) {
    console.error("Error uploading image:", error.message);
    throw new Error(`Error uploading image ${error.message}`);
  }

  const { data: fileData } = await supabaseServer.storage
    .from(storageBucket.personalFile)
    .getPublicUrl(fileName);

  return fileData.publicUrl;
}

export async function deleteFilesFromStorage(filePath: string) {
  const supabaseServer = await createClient();

  console.log("Delete files From storage");

  const { error } = await supabaseServer.storage
    .from(storageBucket.personalFile)
    .remove([filePath]);

  if (error) {
    throw new Error(`Unable to delete ${filePath} from the database`);
  }
}
