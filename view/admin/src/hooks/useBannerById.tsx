import { useEffect, useState } from "react";
import { getBannerById } from "../components/services/serviceApi";
import { useParams } from "react-router";

export default function useFetchBannerById(reset: (values: any) => void) {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchBanner = async () => {
      setLoading(true); 
      try {
        const response = await getBannerById(id);
        const user = response.data.data;

        reset({
          title_english: user.title_english || "",
          title_hindi: user.title_hindi || "",
          sub_title_english: user.sub_title_english || "",
          sub_title_hindi: user.sub_title_hindi || "",
          descr_english: user.descr_english || "",
          descr_hindi: user.descr_hindi || "",
        });
      } catch (err) {
        let msg = "Failed to fetch user";
        if (err instanceof Error) msg = err.message;
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [id, reset]);

  return { loading, error };
}