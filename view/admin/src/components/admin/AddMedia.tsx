import { useState, useEffect } from "react";
import $ from "jquery";
import "summernote/dist/summernote-lite.css";
import "summernote/dist/summernote-lite.js";

import ComponentCard from "./../common/ComponentCard";
import Label from "../form/Label";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";

import { Link } from "react-router-dom";

import { mediaModuleSchema } from "../../validations/validationSchema";
import {
  getMediaModuleById,
  submitMediaModuleForm,
  getAllMediaCategories,
} from "../services/serviceApi";
import toast from "react-hot-toast";

declare global {
  interface JQuery {
    summernote(): JQuery;
    summernote(options: Record<string, unknown>): JQuery;
    summernote(method: string): any;
    summernote(method: "code"): string;
    summernote(method: "code", value: string): JQuery;
  }
}

interface mediaModule {
  media_type: string;
  media_category_id: string;
  upload_photo?: FileList | null;
  upload_video?: FileList | null;
  descr_english?: string | null;
  upload_thumbnail?: FileList | null;
  descr_hindi?: string | null;
}

type MediaCategoryType = {
  id: number;
  name_english: string;
  media_category: string;
};

export default function MediaMasterForm() {
  const [mediaType, setMediaType] = useState("");
  const [title, setTitle] = useState("Add media category");

  const typeOptions = [
    { value: "photos", label: "photos" },
    { value: "videos", label: "videos" },
    { value: "news", label: "news" },
  ];

  const [selectedMediaType, setselectedMediaType] = useState("");

  const navigate = useNavigate();

  const { id } = useParams();
  const isEdit = !!id;

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVidoePreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(mediaModuleSchema(isEdit)) });

  const resetForm = () => {
    reset({
      media_category_id: "",
      media_type: "",
      upload_photo: null,
      upload_video: null,
      upload_thumbnail: null,
      descr_english: "",
      descr_hindi: "",
    });
    setImagePreview("");
    setVidoePreview("");
  };

  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [allCategoryOptions, setAllCategoryOptions] = useState<
    { value: string; label: string; type: string }[]
  >([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllMediaCategories();
        const categories: MediaCategoryType[] = response.data.data;
        const transformed = categories.map((cat) => ({
          value: String(cat.id),
          label: cat.name_english,
          type: cat.media_category,
        }));
        setAllCategoryOptions(transformed);
        setCategoryOptions(transformed);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data: mediaModule) => {
    try {
      const formData = new FormData();

      formData.append("media_category_id", data.media_category_id);
      formData.append(
        "media_type",
        data.media_type ? data.media_type : selectedMediaType
      );

      const englishDescription = getValues("descr_english");
      const hindiDescription = getValues("descr_hindi");

      formData.append("descr_english", englishDescription ?? "");
      formData.append("descr_hindi", hindiDescription ?? "");

      // Only append files if they exist and have content
      if (data.upload_photo?.length && data.upload_photo.length > 0) {
        formData.append("upload_photo", data.upload_photo[0]);
      }

      if (data.upload_thumbnail?.length && data.upload_thumbnail.length > 0) {
        formData.append("upload_photo", data.upload_thumbnail[0]);
      }

      if (data.upload_video?.length && data.upload_video.length > 0) {
        formData.append("upload_video", data.upload_video[0]);
      }

      // Log FormData contents for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const method = id ? "put" : "post";
      const response = await submitMediaModuleForm(
        id ?? null,
        formData,
        method
      );

      const { success, message } = response.data;
      success ? toast.success(`${message}`) : toast.error(`${message}`);

      if (success) {
        resetForm();
        navigate("/media-list");
      } else {
        toast.error(`Error: ${message}`);
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
      reset();
      console.log(`Error: ${msg}`);
    } finally {
    }
  };

  useEffect(() => {
    if (id) {
      setTitle("Update media category");
      getMediaModuleById(id)
        .then((res) => {
          const data = res.data.data;

          reset({
            media_type: data.media_type,
            media_category_id: data.media_category_id,
            descr_english: data.descr_english,
            descr_hindi: data.descr_hindi,
          });

          setMediaType(data.media_type);
          setselectedMediaType(data.media_type);
          setValue("media_type", data.media_type);

          (window.setTimeout as typeof setTimeout)(() => {
            $("#descr_english").summernote("code", data.descr_english || "");
            $("#descr_hindi").summernote("code", data.descr_hindi || "");
          }, 200);

          setImagePreview(
            data.upload_photo
              ? `${import.meta.env.VITE_APP_API_URL}/uploads/images/${
                  data.upload_photo
                }`
              : null
          );

          setThumbnailPreview(
            data.upload_thumbnail
              ? `${import.meta.env.VITE_APP_API_URL}/uploads/images/${
                  data.upload_thumbnail
                }`
              : null
          );

          setVidoePreview(
            data.upload_video
              ? `${import.meta.env.VITE_APP_API_URL}/uploads/videos/${
                  data.upload_video
                }`
              : null
          );
        })
        .catch(() => toast.error(" Error fetching product data"));
    } else {
      setTitle("Add media category");
    }
  }, [id, reset, setValue]);

  useEffect(() => {
    if (!$("#descr_english").next().hasClass("note-editor")) {
      $("#descr_english").summernote({
        height: 150,
        callbacks: {
          onChange: function (contents: string) {
            setValue("descr_english", contents);
          },
        },
      });
    }

    if (!$("#descr_hindi").next().hasClass("note-editor")) {
      $("#descr_hindi").summernote({
        height: 150,
        callbacks: {
          onChange: function (contents: string) {
            setValue("descr_hindi", contents);
          },
        },
      });
    }
  });

  return (
    <ComponentCard title="Add Media" desc={title}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        name="add_product_form"
        id="add_product_form"
        encType="multipart/form-data">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-6">
            <Label>
              Select Media Type<span className="text-red-500">*</span>
            </Label>
            <select
              id="media_type"
              {...register("media_type")}
              value={mediaType}
              onChange={(e) => {
                const value = e.target.value;
                setMediaType(value);
                setselectedMediaType(value);
                if (value === "") {
                  setCategoryOptions([]);
                } else {
                  const filteredCategories = allCategoryOptions.filter(
                    (cat) => cat.type === value
                  );
                  setCategoryOptions(filteredCategories);
                }
                if (id) {
                  setValue("media_type", value);
                }
              }}
              className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-1 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
              <option value="">Select Media Type</option>
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute right-4 top-10 flex items-center text-gray-500">
              ▼
            </div>

            {typeof errors.media_type?.message === "string" && (
              <p className="error">{errors.media_type.message}</p>
            )}
          </div>

          <div className="col-span-12 md:col-span-6">
            <Label>
              Select Media Category (English)
              <span className="text-red-500">*</span>
            </Label>
            <select
              id="media_category_id"
              {...register("media_category_id")}
              className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-1 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
              <option
                className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                value="">
                Select Media Category
              </option>
              {categoryOptions.length === 0 ? (
                <option disabled>No category found</option>
              ) : (
                categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))
              )}
            </select>
            <div className="pointer-events-none absolute right-4 top-10 flex items-center text-gray-500">
              ▼
            </div>

            {typeof errors.media_category_id?.message === "string" && (
              <p className="error">{errors.media_category_id.message}</p>
            )}
          </div>

          {/* Conditional Uploads */}
          {mediaType === "photos" && (
            <>
              <div className="col-span-12 md:col-span-6">
                <Label>
                  Upload Photo (85 × 94 Px)
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
                  id="upload_photo"
                  {...register("upload_photo")}
                />

                {typeof errors.upload_photo?.message === "string" && (
                  <p className="error">{errors.upload_photo.message}</p>
                )}
              </div>
            </>
          )}

          {mediaType === "videos" && (
            <>
              <div className="col-span-12 md:col-span-6">
                <Label>
                  Upload Video (Video Ratio 1920×1080 Px)
                  {!isEdit && <span className="text-red-500">*</span>}
                  {videoPreview && (
                    <Link
                      to={videoPreview}
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
                  accept="video/*"
                  className="focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:text-white/90 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 dark:placeholder:text-gray-400"
                  placeholder="choose file"
                  id="upload_video"
                  {...register("upload_video")}
                />

                {typeof errors.upload_video?.message === "string" && (
                  <p className="error">{errors.upload_video.message}</p>
                )}
              </div>
              <div className="col-span-12 md:col-span-6">
                <Label>
                  Upload Photo (Video Ratio 1920×1080 Px)
                  {!isEdit && <span className="text-red-500">*</span>}
                  {thumbnailPreview && (
                    <Link
                      to={thumbnailPreview}
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
                  id="upload_thumbnail"
                  {...register("upload_thumbnail")}
                />

                {typeof errors.upload_thumbnail?.message === "string" && (
                  <p className="error">{errors.upload_thumbnail.message}</p>
                )}
              </div>
            </>
          )}

          {mediaType === "news" && (
            <>
              <div className="col-span-12 md:col-span-6">
                <Label>
                  Upload Photo (85 × 94 Px)
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
                  id="upload_photo"
                  {...register("upload_photo")}
                />

                {typeof errors.upload_photo?.message === "string" && (
                  <p className="error">{errors.upload_photo.message}</p>
                )}
              </div>

              <div className="col-span-12 md:col-span-6">
                <Label>
                  Upload Video (Video Ratio 1920×1080 Px)
                  {!isEdit && <span className="text-red-500">*</span>}
                  {videoPreview && (
                    <Link
                      to={videoPreview}
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
                  accept="video/*"
                  className="focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:text-white/90 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 dark:placeholder:text-gray-400"
                  placeholder="choose file"
                  id="upload_video"
                  {...register("upload_video")}
                />

                {typeof errors.upload_video?.message === "string" && (
                  <p className="error">{errors.upload_video.message}</p>
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
                  // value={"descr_english"}
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
            </>
          )}

          {/* Submit */}
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
  );
}
