import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import { categorySchema } from "../../validations/validationSchema";
import { getCategoryById, submitCategoryForm } from "../services/serviceApi";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams, Link } from "react-router-dom";

import NewInput from "../form/input/NewInputField";
import CategoryList from "./CategoryList";
import toast from "react-hot-toast";

interface CategoryFormValues {
  title_english: string;
  title_hindi: string;
  upload_img?: FileList | null;
}

export default function CategoryForm() {
  const [refresh, setRefresh] = useState(false);
  const [title, setTitle] = useState("Add category");

  const navigate = useNavigate();

  Modal.setAppElement("#root");

  const { id } = useParams();
  const isEdit = !!id;
  const [imagePreview, setImagePreview] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(categorySchema(isEdit)) });

  const resetForm = () => {
    reset({
      title_english: "",
      title_hindi: "",
      upload_img: null,
    });
    setImagePreview("");
  };

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      const formData = new FormData();
      formData.append("title_english", data.title_english);
      formData.append("title_hindi", data.title_hindi);
      if (data.upload_img?.length) {
        formData.append("upload_img", data.upload_img[0]);
      }
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const method = id ? "put" : "post";
      const response = await submitCategoryForm(id ?? null, formData, method);
      const { success, message } = response.data;
      console.log("Response:", response.data);
      success ? toast.success(`${message}`) : toast.error(`${message}`);

      if (success) {
        resetForm();
        navigate("/add-category");
        setRefresh(!refresh);
      } else {
        toast.error(`${message}`);
      }
    } catch (err) {
      let msg = "An unexpected error occurred";

      if (err instanceof Error) {
        msg = err.message;
      }
      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosErr = err as { response: { data: { message: string } } };
        msg = axiosErr.response?.data?.message || msg;
      }

      console.log(`Error: ${msg}`);
    } finally {
      // resetForm();
    }
  };

  useEffect(() => {
    if (id) {
      setTitle("Update category");

      getCategoryById(id)
        .then((res) => {
          const data = res.data.data;
          reset({
            title_english: data.title_english,
            title_hindi: data.title_hindi,
            upload_img: undefined,
          });
          if (data.upload_img) {
            setImagePreview(
              `${import.meta.env.VITE_APP_API_URL}/uploads/images/${
                data.upload_img
              }`
            );
          }
        })
        .catch(() => toast.error("Error fetching media data"));
    } else {
      setTitle("Add category");
    }
  }, [id, reset]);

  return (
    <div className="space-y-6">
      <ComponentCard title="Product Category Master" desc={title}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          name="add_student_form"
          id="add_student_form"
          encType="multipart/form-data">
          <div className="grid grid-cols-12 gap-6">
            {/* English Title */}
            <div className="col-span-12 md:col-span-4">
              <Label>
                Title (English) <span className="text-red-500">*</span>
              </Label>
              <NewInput
                name="title_english"
                type="text"
                placeholder="Enter title in english"
                className="w-full"
                register={register}
                errors={errors}
              />
            </div>

            {/* Hindi Title */}
            <div className="col-span-12 md:col-span-4">
              <Label>
                Title (Hindi) <span className="text-red-500">*</span>
              </Label>
              <NewInput
                name="title_hindi"
                type="text"
                placeholder="Enter title in hindi"
                className="w-full"
                register={register}
                errors={errors}
              />
            </div>

            {/* Image */}
            <div className="col-span-12 md:col-span-4">
              <Label>
                Upload Image <span className="text-red-500">*</span>{" "}
                <span className="text-red-500">
                  ( Recommended : PNG, JPEG, JPG | 60 × 60 px )
                </span>
                {!isEdit}
                {imagePreview && (
                  <Link
                    to={imagePreview}
                    target="_blank"
                    rel="noopener noreferrer">
                    <span className="text-blue-500 hover:underline ml-2">
                      Preview
                    </span>
                  </Link>
                )}
              </Label>
              <input
                type="file"
                accept=".png,.jpg,.jpeg"
                className="focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:text-white/90 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 dark:placeholder:text-gray-400"
                placeholder="choose file"
                id="upload_img"
                {...register("upload_img")}
              />

              {errors.upload_img?.message && (
                <p className="error">{errors.upload_img.message.toString()}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="col-span-12">
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                // disabled={isSubmitting}>
              >
                {/* {loading ? "Submitting..." : "Submit"} */}
                Submit
              </button>
            </div>
          </div>
        </form>
      </ComponentCard>
      <div className="p-4 bg-white rounded-xl shadow">
        <CategoryList refresh={refresh} setRefresh={setRefresh} />
      </div>
    </div>
  );
}
