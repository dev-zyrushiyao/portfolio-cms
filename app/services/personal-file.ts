"use server";

import { uploadPublicFilesToStorage } from "./storage";
import { createClient } from "./supabase/server";

export interface PersonalFileProp {
  id: string;
  title: string;
  type: string;
  category: string;
  link: string;
}

export type FormState = {
  success: boolean;
  message: string;
} | null;

export async function getAllPersonalFile(): Promise<PersonalFileProp[] | []> {
  const supabaseServer = await createClient();

  const { data, error } = await supabaseServer.from("file").select("*");

  if (error) {
    throw Error(`Error: ${error.name} - ${error.message}`);
  }

  return data as PersonalFileProp[] | [];
}

export async function postFile(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  //fetch formData
  const file = formData.get("file") as File;
  const category = formData.get("category");

  if (!file) {
    throw new Error("Invalid file");
  }

  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "application/pdf",
    "image/svg+xml",
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      message: `Error: ${file.type} is Invalid file`,
    } as FormState;
  }

  const titleWithoutExtension = file.name.substring(
    0,
    file.name.lastIndexOf("."),
  );

  const title = titleWithoutExtension;
  const type = file.type.split("/")[1]; //show only jpeg instead of images/jpeg; split makes it ['images' , 'jpeg']
  const fileUrl = await uploadPublicFilesToStorage(file);

  const supabaseServer = await createClient();
  const { error } = await supabaseServer
    .from("file")
    .insert({ title, type, category, link: fileUrl });

  if (error) {
    return { success: false, message: `Error: ${error.message}` } as FormState;
  }

  return {
    success: true,
    message: "File has been successfully uploaded",
  } as FormState;
}

export async function deleteFileById(id: string) {
  const supabaseServer = await createClient();

  const { error } = await supabaseServer.from("file").delete().eq("id", id);

  if (error) {
    throw new Error(`Error: ${error.message} `);
  }
}
