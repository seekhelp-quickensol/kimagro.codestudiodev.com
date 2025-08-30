 
import { useEffect, useState } from "react";
import { getAllCategories, RawCategory } from "../services/service";

interface CategoryItem {
  id: number;
  name: string;
  nameHindi: string;
  icon: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();

        if (response.success) {
          const mapped = response.data.map((category: RawCategory) => ({
            id: category.id,
            name: category.title_english,
            nameHindi: category.title_hindi,
            icon: category.upload_img
              ? `${import.meta.env.VITE_APP_BACKEND}uploads/images/${category.upload_img}`
              : "/assets/images/product-category/default-icon.png",
          }));
          setCategories(mapped);
        } else {
          setError(response.message || "Failed to fetch categories");
        }
      } catch (err) {
        setError((err as Error).message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};