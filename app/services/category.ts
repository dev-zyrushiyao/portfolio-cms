import supabase from "./supabase";

export interface CategoryProp {
  id: number;
  createdAt: string;
  category_type: string;
}

//fetch the whole list
export default async function getCategories(): Promise<CategoryProp[] | []> {
  const { data, error } = await supabase.from("category").select("*");

  if (error) {
    throw new Error("Unable to fetch data from category");
  }

  return (data as CategoryProp[]) || [];
}

export function convertDate(date: string): string {
  if (!date) return;

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return formattedDate;
}
