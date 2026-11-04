import supabase from "./supabase/client";

export interface ContactProp {
  id: number;
  subject: string;
  sender_name: string;
  sender_email: string;
  message: string;
  category_id: number;
  created_at: string;
  read: boolean;
}
export default async function getContacts(): Promise<ContactProp[] | []> {
  const { data, error } = await supabase
    .from("contact")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    throw new Error("Unable to fetch data from contact");
  }

  return (data as ContactProp[]) || [];
}

export async function updateContactRead(
  id: number,
  readStatus: boolean,
): Promise<void> {
  const { error } = await supabase
    .from("contact")
    .update({ read: readStatus })
    .eq("id", id);

  if (error) {
    throw new Error(error?.message);
  }
}
