import supabase from "./supabase";

export async function addTechstack(
  imagePath: string,
  imageName: string,
): Promise<void> {
  const image_path = imagePath;
  const image_name = imageName;

  const { error } = await supabase
    .from("techstack")
    .insert({ image_name, image_path });

  if (error) {
    throw new Error(`Failed to store image path: ${error.message}`);
  }
}
