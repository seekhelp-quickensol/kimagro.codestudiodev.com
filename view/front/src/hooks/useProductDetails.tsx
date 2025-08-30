import { useState, useEffect } from "react";
 
import { useParams } from "react-router";
import { getProductDetails, ProductDetails } from "../services/service";

const useProductDetails = () => {

  const {id} = useParams();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (!id) return;
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await getProductDetails(id);
        const result = response.data;
        
        if (result.success) {
            setProduct(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, []);

  return { product, loading, error };
};

export default useProductDetails;