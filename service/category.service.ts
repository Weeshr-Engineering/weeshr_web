import { fetchCategories } from "@/lib/api";

/**
 * Fetch all categories
 */
export async function getAllCategoriesService() {
  try {
    const categories = await fetchCategories();
    return categories.map((cat: any) => ({
      id: cat._id,
      title: cat.name,
      image: cat.image?.secure_url,
      color: "bg-[#C6EDF6]", // fallback color (can customize per category)
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

/**
 * Fetch a single category by ID
 */
export async function getCategoryByIdService(id: string) {
  if (!id) throw new Error("Category ID is required");

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/${id}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (res.ok && data?.code === 200) {
      return data.data;
    } else {
      console.warn(
        "Failed to fetch category:",
        data?.message || res.statusText
      );
      return null;
    }
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    return null;
  }
}
 