import { useEffect, useState } from "react";
import $ from "jquery";
import "summernote/dist/summernote-lite.css";
import "summernote/dist/summernote-lite.js";

import { innovationSchema } from "../../validations/validationSchema";
import {
  getInnovationDataById,
  submitInnovationForm,
} from "../services/serviceApi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams, Link } from "react-router-dom";

declare global {
  interface JQuery {
    summernote(): JQuery;
    summernote(options: Record<string, unknown>): JQuery;
    summernote(method: string): any;
    summernote(method: "code"): string;
    summernote(method: "code", value: string): JQuery;
  }
}

// interface Innovation {
//   upload_icon: FileList;
//   upload_img: FileList;
//   bio_balance_eng: string;
//   bio_balance_hindi: string;
//   descr_english?: string | null;
//   descr_hindi?: string | null;
// }
type InnovationFormValues = {
  upload_icon?: FileList | null | undefined;
  upload_img?: FileList | null | undefined;
  bio_balance_eng: string;
  bio_balance_hindi: string;
  descr_english?: string | null;
  descr_hindi?: string | null;
};

import ComponentCard from "./../common/ComponentCard";
import Label from "../form/Label";
import toast from "react-hot-toast";

export default function InnovationForm() {
  const navigate = useNavigate();
  const { id, product_id } = useParams();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [iconPreview, setIconPreview] = useState("");
  const [title, setTitle] = useState("Add new innovation details");
  const isEdit = !!id;

  const {
    register,
    handleSubmit,
    setValue,
    // getValues,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: yupResolver(innovationSchema(isEdit)) });

  const resetForm = () => {
    reset({
      upload_icon: undefined,
      upload_img: undefined,
      bio_balance_eng: "",
      bio_balance_hindi: "",
      descr_english: "",
      descr_hindi: "",
    });
    setImagePreview("");
    setIconPreview("");
    $("#descr_english").summernote("code", "");
    $("#descr_hindi").summernote("code", "");
  };

  const onSubmit = async (data: InnovationFormValues) => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("bio_balance_eng", data.bio_balance_eng);
      formData.append("bio_balance_hindi", data.bio_balance_hindi);

      if (product_id !== undefined) {
        formData.append("product_id", product_id);
      }

      const englishDescription = $("#descr_english").summernote("code");
      const hindiDescription = $("#descr_hindi").summernote("code");

      formData.append("descr_english", englishDescription ?? "");
      formData.append("descr_hindi", hindiDescription ?? "");

      if (data.upload_icon?.length) {
        formData.append("upload_icon", data.upload_icon[0]);
      }

      if (data.upload_img?.length) {
        formData.append("upload_img", data.upload_img[0]);
      }

      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const method = id ? "put" : "post";
      const response = await submitInnovationForm(id ?? null, formData, method);
      const { success, message } = response.data;
      success ? toast.success(`${message}`) : toast.error(`Error: ${message}`);

      if (success) {
        resetForm();
        navigate("/product-list");
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

      resetForm();
      console.log(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      setTitle("Update new innovation details");
      getInnovationDataById(id).then((res) => {
        const data = res.data.data;
        reset({
          bio_balance_eng: data.bio_balance_eng,
          bio_balance_hindi: data.bio_balance_hindi,
          descr_english: data.descr_english,
          descr_hindi: data.descr_hindi,
        });

        (window.setTimeout as typeof setTimeout)(() => {
          $("#descr_english").summernote("code", data.descr_english || "");
          $("#descr_hindi").summernote("code", data.descr_hindi || "");
        }, 200);
        setIconPreview(
          `${import.meta.env.VITE_APP_API_URL}/uploads/images/${
            data.upload_icon
          }`
        );
        setImagePreview(
          `${import.meta.env.VITE_APP_API_URL}/uploads/images/${
            data.upload_img
          }`
        );
      });
    } else {
      setTitle("Add new innovation details");
    }
  }, [id, reset]);

  useEffect(() => {
    if (!$("#descr_english").next().hasClass("note-editor")) {
      $("#descr_english").summernote({
        height: 150,
        callbacks: {
          onChange: (contents: string) => setValue("descr_english", contents),
        },
      });
    }

    if (!$("#descr_hindi").next().hasClass("note-editor")) {
      $("#descr_hindi").summernote({
        height: 150,
        callbacks: {
          onChange: (contents: string) => setValue("descr_hindi", contents),
        },
      });
    }
  }, [setValue]);

  return (
    <ComponentCard title="Innovation" desc={title}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        name="add_product_form"
        id="add_product_form"
        encType="multipart/form-data">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-6">
            <Label>
              Upload Icon (85 × 94 Px)
              {!isEdit && <span className="text-red-500">*</span>}
              {iconPreview && (
                <Link
                  to={iconPreview}
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
              accept=".png,.jpg,.jpeg,.svg"
              className="focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:text-white/90 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 dark:placeholder:text-gray-400"
              placeholder="choose file"
              id="upload_icon"
              {...register("upload_icon")}
            />

            {typeof errors.upload_icon?.message === "string" && (
              <p className="error">{errors.upload_icon.message}</p>
            )}
          </div>

          {/* Upload Image */}
          <div className="col-span-12 md:col-span-6">
            <Label>
              Upload Image (85 × 94 Px)
              {!isEdit && <span className="text-red-500">*</span>}
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
              accept=".png,.jpg,.jpeg,.svg"
              className="focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:text-white/90 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 dark:placeholder:text-gray-400"
              placeholder="choose file"
              id="upload_img"
              {...register("upload_img")}
            />

            {typeof errors.upload_img?.message === "string" && (
              <p className="error">{errors.upload_img.message}</p>
            )}
          </div>
          <div className="col-span-12 md:col-span-6">
            <Label>
              Bio Balance (English)
              <span className="text-red-500">*</span>
            </Label>
            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded p-2 h-22 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="bio_balance_eng"
              placeholder="Enter Bio Balance in english"
              {...register("bio_balance_eng")}
            />
            {typeof errors.bio_balance_eng?.message === "string" && (
              <p className="error">{errors.bio_balance_eng.message}</p>
            )}
          </div>
          <div className="col-span-12 md:col-span-6">
            <Label>
              Bio Balance (Hindi)
              <span className="text-red-500">*</span>
            </Label>
            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded p-2 h-22 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="bio_balance_hindi"
              placeholder="Enter Bio Balance in english"
              {...register("bio_balance_hindi")}
            />
            {typeof errors.bio_balance_hindi?.message === "string" && (
              <p className="error">{errors.bio_balance_hindi.message}</p>
            )}
          </div>
          <div className="col-span-12 md:col-span-6">
            <Label>
              Description (English)<span className="text-red-500">*</span>
            </Label>
            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded p-2 h-22 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="descr_english"
              placeholder="Enter description in english"
              {...register("descr_english")}
            />
            {typeof errors.descr_english?.message === "string" && (
              <p className="error">{errors.descr_english.message}</p>
            )}
          </div>
          <div className="col-span-12 md:col-span-6">
            <Label>
              Description (Hindi)<span className="text-red-500">*</span>
            </Label>
            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded p-2 h-22 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="descr_hindi"
              placeholder="Enter description in hindi"
              {...register("descr_hindi")}
            />
            {typeof errors.descr_hindi?.message === "string" && (
              <p className="error">{errors.descr_hindi.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="col-span-12">
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              disabled={isSubmitting}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </ComponentCard>
  );
}
