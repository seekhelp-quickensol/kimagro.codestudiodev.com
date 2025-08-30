import { useEffect, useState } from "react";
import { getDesignationById, Designation } from "../components/services/serviceApi";
import { useParams } from "react-router";

export default function useFetchDesignationById(reset: (values: any) => void) {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState<string>("Add Designation");

  useEffect(() => {
    if (!id) {
      setTitle("Add designation");
      return};
      setTitle("Update designation");
    const fetchDesignation = async () => {
      setLoading(true);
      try {
        const response = await getDesignationById(id);
        const designation:Designation = response.data.data;

        reset({
          designation_name: designation.designation_name || "",
        });
      } catch (err) {
        let msg = "Failed to fetch user";
        if (err instanceof Error) msg = err.message;
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchDesignation();
  }, [id, reset]);

  return { loading, error ,title};
}