import supabase from "./supabase/client";

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
