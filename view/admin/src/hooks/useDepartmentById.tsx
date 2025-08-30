import { useEffect, useState } from "react";
import {
  Department,
  getDepartmentById,
} from "../components/services/serviceApi";
import { useParams } from "react-router";

export default function useFetchDepartmentById(reset: (values: any) => void) {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [title,setTitle] = useState<string>("Add department");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setTitle("Add department");
      return;
    };
    setTitle("Update department");

    const fetchDepartment = async () => {
      setLoading(true);
      try {
        const response = await getDepartmentById(id);
        const department:Department = response.data.data;
        reset({
          department_name: department.department_name || "",
        });
      } catch (err) {
        let msg = "Failed to fetch department";
        if (err instanceof Error) msg = err.message;
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id, reset]);

  return { loading, error, title };
}
