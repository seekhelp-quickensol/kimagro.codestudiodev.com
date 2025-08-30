// import { useState, useEffect } from "react";
 
// import { useParams } from "react-router";
// import { getProductsByCategory, ProductsByCategory } from "../services/service";

// const useProductByCat = () => {

//   const {id} = useParams();
//  const [category, setCategory] = useState<ProductsByCategory>();

//   const [loading, setLoading] = useState(true);
//   const [error, setError] =  useState<string | null>(null);


//   useEffect(() => {
//     if (!id) return;
//     const fetchProducts = async () => {
//       try {
//         setLoading(true);
//         const response = await getProductsByCategory(id);
//         const result = response.data;
 
//         if (result.success) {
//             setCategory(result.data);
//         } else {
//           setError(result.message);
//         }
//       } catch (err) {
//         setError("Failed to fetch category");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   return { category, loading, error };
// };

// export default useProductByCat;



import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getProductsByCategory, ProductsByCategory, Product } from "../services/service";

const PRODUCTS_PER_PAGE = 10; // Adjust as needed

const useProductByCat = () => {
  const { id } = useParams();
  const [category, setCategory] = useState<ProductsByCategory>();
  const [products, setProducts] = useState<Product[] >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (page: number, isLoadMore = false) => {
    try {
      if (!isLoadMore) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const response = await getProductsByCategory(id!, page, PRODUCTS_PER_PAGE);
      const result = response.data;
      

      if (result.success) {
        if (!isLoadMore) {
          // Initial load or refresh
          setCategory({
            categoryId: result.data.categoryId,
            categoryNameEnglish: result.data.categoryNameEnglish,
            categoryNameHindi: result.data.categoryNameHindi,
          });
          console.log("Category:", result);
          setProducts(result.data.products ?? []);
        } else {
          // Load more - append new products
          setProducts(prevProducts => [...prevProducts, ...(result.data.products ?? [])]);
        }
        
        setTotalProducts(result.data.totalProducts ?? 0);
        setHasMore(
          Array.isArray(result.data.products) &&
            result.data.products.length === PRODUCTS_PER_PAGE &&
            products.length + result.data.products.length < (result.data.totalProducts || 0)
        );
        
        if (isLoadMore) {
          setCurrentPage(page);
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to fetch products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreProducts = () => {
    if (!loadingMore && hasMore) {
      fetchProducts(currentPage + 1, true);
    }
  };

  useEffect(() => {
    if (!id) return;
    
    // Reset state when category changes
    setProducts([]);
    setCurrentPage(1);
    setHasMore(true);
    setError(null);
    
    fetchProducts(1, false);
  }, [id]);

  return { 
    category, 
    products, 
    loading, 
    loadingMore, 
    hasMore, 
    totalProducts,
    loadMoreProducts, 
    error 
  };
};

export default useProductByCat;