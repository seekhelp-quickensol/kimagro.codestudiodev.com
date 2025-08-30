import { useEffect, useState } from "react";
import { getUserById, User } from "../components/services/serviceApi";
import { useParams } from "react-router";

export default function useFetchUserById(reset: (values: any) => void) {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const[title,setTitle] = useState<string>("Add User");

  useEffect(() => {
    if (!id) {
      setTitle("Add User");
      return
    };
    setTitle("Update User");
    const fetchUser = async () => {
      setLoading(true); 
      try {
        const response = await getUserById(id);
        const user: User = response.data.data;

        reset({
          first_name: user.first_name || "",
          middle_name: user.middle_name || "",
          last_name: user.last_name || "",
          email: user.email || "",
          username: user.username || "",
          password: "", // Optional: leave blank for security
          department_id: Number(user.department_id) || 0,
          designation_id: Number(user.designation_id) || 0,
        });
      } catch (err) {
        let msg = "Failed to fetch user";  
        if (err instanceof Error) msg = err.message;
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, reset]);

  return { loading, error,title };
}