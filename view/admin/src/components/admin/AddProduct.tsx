import { useEffect, useState } from "react";
import React from "react";
import $ from "jquery";
import "summernote/dist/summernote-lite.css";
import "summernote/dist/summernote-lite.js";
import TagInput from "../form/TagInput";

import { Link } from "react-router-dom";
import NewInput from "../form/input/NewInputField";

import { productSchema } from "../../validations/validationSchema";
import {
  getProdcutById,
  submitProductForm,
  getAllCategoriees,
  getAllSKUS,
} from "../services/serviceApi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";

declare global {
  interface JQuery {
    summernote(): JQuery;
    summernote(options: Record<string, unknown>): JQuery;
    summernote(method: string): any;
    summernote(method: "code"): string;
    summernote(method: "code", value: string): JQuery;
  }
}

type SKUSType = {
  id: number;
  quantity: string;
  unit: string;
};

interface Product {
  product_category_id: string;
  product_name_english: string;
  product_name_hindi: string;
  product_tag_english?: string | null;
  product_tag_hindi?: string | null;
  product_title_english: string;
  product_title_hindi: string;
  sku_id: string[];
  // sku_id: string;
  short_descr_english: string;
  short_descr_hindi: string;
  product_img?: FileList | null | undefined;
  upload_brouch_english?: FileList | null | undefined;
  upload_brouch_hindi?: FileList | null | undefined;
  descr_english?: string | null;
  descr_hindi?: string | null;
  upload_multiple_img?: FileList | null | undefined;
}

import ComponentCard from "./../common/ComponentCard";
import Label from "../form/Label";
import toast from "react-hot-toast";
import MultiSelect from "../../components/form/ControllerdMutiSelect";

export default function ProductForm() {
  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [skusOptions, setSKUOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const navigate = useNavigate();

  const { id } = useParams();
  const [title, setTitle] = useState<string>("Add Product");

  const [loading, setLoading] = useState(false);

  const [imagePreview, setImagePreview] = useState("");
  const [enBrouchPreview, setEnBrouchPreview] = useState("");
  const [hiBrouchPreview, setHiBrouchPreview] = useState("");
  const [multipleImagePreview, setMultipleImagePreview] = useState<string[]>(
    []
  );

  const [imageArray, setImageArray] = useState<File[]>([]);
  const isEdit = !!id;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategoriees();
        const categories = response.data.data;
        const transformed = categories.map((cat) => ({
          value: String(cat.id),
          label: cat.title_english,
        }));
        setCategoryOptions(transformed);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchskus = async () => {
      try {
        const response = await getAllSKUS();
        const skus: SKUSType[] = response.data.data;
        const transformed = skus.map((sku) => ({
          value: String(sku.id),
          label: sku.quantity + " " + sku.unit,
        }));
        setSKUOptions(transformed);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchskus();
  }, []);

  const fileSelectedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setImageArray((prev) => [...prev, ...fileArray]);
      console.log(fileArray);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: yupResolver(productSchema(isEdit)) });

  const resetForm = () => {
    reset({
      product_category_id: "",
      product_name_english: "",
      product_name_hindi: "",
      product_tag_english: "",
      product_tag_hindi: "",
      product_img: undefined,
      product_title_english: "",
      product_title_hindi: "",
      sku_id: [],
      // sku_id: "",
      short_descr_english: "",
      short_descr_hindi: "",
      upload_brouch_english: undefined,
      upload_brouch_hindi: undefined,
      descr_english: "",
      descr_hindi: "",
      upload_multiple_img: undefined,
    });
    setImagePreview("");
    setEnBrouchPreview("");
    setHiBrouchPreview("");
  };

  const onSubmit = async (data: Product) => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("product_category_id", data.product_category_id);
      formData.append("product_name_english", data.product_name_english);
      formData.append("product_name_hindi", data.product_name_hindi);
      // if (data.product_tag_english) {
      //   formData.append("product_tag_english", data.product_tag_english);
      // } else {
      //   formData.append("product_tag_english", "");
      // }

      // if (data.product_tag_hindi) {
      //   formData.append("product_tag_hindi", data.product_tag_hindi);
      // } else {
      //   formData.append("product_tag_hindi", "");
      // }

      formData.append("product_tag_english", data.product_tag_english ?? "");
      formData.append("product_tag_hindi", data.product_tag_hindi ?? "");

      formData.append("product_title_english", data.product_title_english);
      formData.append("product_title_hindi", data.product_title_hindi);
      // formData.append("sku_id", data.sku_id);
      formData.append("sku_id", data.sku_id.join(","));
      formData.append("short_descr_english", data.short_descr_english);
      formData.append("short_descr_hindi", data.short_descr_hindi);

      if (data.upload_brouch_english?.length) {
        formData.append("upload_brouch_english", data.upload_brouch_english[0]);
      }
      if (data.upload_brouch_hindi?.length) {
        formData.append("upload_brouch_hindi", data.upload_brouch_hindi[0]);
      }

      imageArray.forEach((file) => {
        formData.append("upload_multiple_img", file);
      });

      const englishDescription = getValues("descr_english");
      const hindiDescription = getValues("descr_hindi");

      formData.append("descr_english", englishDescription ?? "");
      formData.append("descr_hindi", hindiDescription ?? "");

      if (data.product_img?.length) {
        formData.append("product_img", data.product_img[0]);
      }

      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      console.log(formData);

      const method = id ? "put" : "post";
      const response = await submitProductForm(id ?? null, formData, method);
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
      toast.error(`Error: ${msg}`);
      console.log(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      setTitle("Update Product");
      getProdcutById(id)
        .then((res) => {
          const data = res.data.data;
          let multipleImages: string[] = [];

          if (Array.isArray(data.upload_multiple_img)) {
            multipleImages = data.upload_multiple_img.filter(
              (img: string) => img.trim() !== ""
            );
          } else if (typeof data.upload_multiple_img === "string") {
            multipleImages = data.upload_multiple_img
              .split(",")
              .map((img: string) => img.trim())
              .filter((img: string) => img !== "");
          }

          console.log("Parsed multipleImagePreview:", multipleImages);
          setMultipleImagePreview(multipleImages);

          reset({
            product_category_id: data.product_category_id,
            product_name_english: data.product_name_english,
            product_name_hindi: data.product_name_hindi,
            product_tag_english: Array.isArray(data.product_tag_english)
              ? data.product_tag_english.map((tag: string) => ({
                value: tag,
                label: tag,
              }))
              : [],
            product_tag_hindi: Array.isArray(data.product_tag_hindi)
              ? data.product_tag_hindi.map((tag: string) => ({
                value: tag,
                label: tag,
              }))
              : [],
            product_title_english: data.product_title_english,
            product_title_hindi: data.product_title_hindi,
            sku_id: data.sku_id,
            short_descr_english: data.short_descr_english,
            short_descr_hindi: data.short_descr_hindi,
            descr_english: data.descr_english,
            descr_hindi: data.descr_hindi,
          });

          (window.setTimeout as typeof setTimeout)(() => {
            $("#descr_english").summernote("code", data.descr_english || "");
            $("#descr_hindi").summernote("code", data.descr_hindi || "");
          }, 200);
          setImagePreview(
            `${import.meta.env.VITE_APP_API_URL}/uploads/images/${data.product_img
            }`
          );
          setEnBrouchPreview(
            `${import.meta.env.VITE_APP_API_URL}/uploads/brochures/${data.upload_brouch_english
            }`
          );
          setHiBrouchPreview(
            `${import.meta.env.VITE_APP_API_URL}/uploads/brochures/${data.upload_brouch_hindi
            }`
          );
        })
        .catch(() => toast.error("Error fetching product data"));
    } else {
      setTitle("Add Product");
    }
  }, [id, reset]);

  useEffect(() => {
    if (!$("#descr_english").next().hasClass("note-editor")) {
      $("#descr_english").summernote({
        height: 150,
        callbacks: {
          onChange: function (contents: string) {
            setValue("descr_english", contents);
          },
        },
        dialogsInBody: true,
        toolbar: [
          ['style', ['style']],
          ['font', ['bold', 'underline', 'clear']],
          ['fontname', ['fontname']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['table', ['table']],
          ['insert', ['link', 'picture']],
          ['view', ['codeview']]

        ]
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
        dialogsInBody: true,
        toolbar: [
          ['style', ['style']],
          ['font', ['bold', 'underline', 'clear']],
          ['fontname', ['fontname']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['table', ['table']],
          ['insert', ['link', 'picture']],
          ['view', ['codeview']]

        ]
      });
    }
  }, [setValue]);

  return (
    <ComponentCard title={title}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        name="add_product_form"
        id="add_product_form"
        encType="multipart/form-data">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4">
            <Label>
              Product Category <span className="text-red-500">*</span>
            </Label>

            <select
              id="product_category_id"
              {...register("product_category_id")}
              className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-1 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
              <option
                className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                value="">
                Select Product Category
              </option>
              {categoryOptions.length === 0 ? (
                <option disabled>No categories found</option>
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

            {typeof errors.product_category_id?.message === "string" && (
              <p className="error">{errors.product_category_id.message}</p>
            )}
          </div>

          {/* Product Name */}
          <div className="col-span-12 md:col-span-4">
            <Label>
              Product Name (English) <span className="text-red-500">*</span>
            </Label>
            <NewInput
              name="product_name_english"
              type="text"
              placeholder="Enter product name in english"
              className="w-full"
              register={register}
              errors={errors}
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <Label>
              Product Name (Hindi) <span className="text-red-500">*</span>
            </Label>
            <NewInput
              name="product_name_hindi"
              type="text"
              placeholder="Enter product name in hindi"
              className="w-full"
              register={register}
              errors={errors}
            />
          </div>

          <div className="col-span-12 md:col-span-4 taginput">
            <Label>Product Tag (English) </Label>
            <TagInput
              name="product_tag_english"
              placeholder="Enter product tag in english"
              control={control}
            />
            {/* <NewInput
              name="product_tag_english"
              type="text"
              placeholder="Enter product tag in english"
              className="w-full"
              register={register}
              errors={errors}
            /> */}
          </div>

          <div className="col-span-12 md:col-span-4 taginput">
            <Label>Product Tag (Hindi) </Label>
            <TagInput
              name="product_tag_hindi"
              placeholder="Enter product tag in hindi"
              control={control}
            />
            {/* <NewInput
              name="product_tag_hindi"
              type="text"
              placeholder="Enter product tag in hindi"
              className="w-full"
              register={register}
              errors={errors}
            /> */}
          </div>

          {/* Product Image */}
          <div className="col-span-12 md:col-span-4">
            <Label>
              Product Image <span className="text-red-500">*</span>{" "}
              <span className="text-red-500">
                ( Recommended : PNG, JPEG, JPG | 124 × 152 px )
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
              id="product_img"
              {...register("product_img")}
            />

            {typeof errors.product_img?.message === "string" && (
              <p className="error">{errors.product_img.message}</p>
            )}
          </div>

          {/* Product Title */}
          <div className="col-span-12 md:col-span-4">
            <Label>
              Product Title (English) <span className="text-red-500">*</span>
            </Label>
            <NewInput
              name="product_title_english"
              type="text"
              placeholder="Enter title in english"
              className="w-full"
              register={register}
              errors={errors}
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <Label>
              Product Title (Hindi) <span className="text-red-500">*</span>
            </Label>
            <NewInput
              name="product_title_hindi"
              type="text"
              placeholder="Enter title in hindi"
              className="w-full"
              register={register}
              errors={errors}
            />
          </div>

          {/* SKU */}

          <div className="col-span-12 md:col-span-4">
            <Label>
              SKU <span className="text-red-500">*</span>
            </Label>
            <MultiSelect
              name="sku_id"
              control={control}
              options={skusOptions}
              placeholder="Select SKU"
            />
            {typeof errors.sku_id?.message === "string" && (
              <p className="mt-1.5 text-xs text-error-500">
                {errors.sku_id.message}
              </p>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <div className="flex items-center gap-4 flex-wrap">
              <Label>
                Product Multiple Images <span className="text-red-500">*</span>
                <span className="text-red-500">
                  ( Recommended : PNG, JPEG, JPG | 297 × 579 px )
                </span>
                <div className="flex gap-2 flex-wrap">
                  {!isEdit}
                  {multipleImagePreview.map((img, i) => {
                    const imageUrl = `${import.meta.env.VITE_APP_API_URL
                      }/uploads/images/${img}`;
                    return (
                      <Link
                        key={i}
                        to={imageUrl}
                        target="_blank"
                        rel="noopener noreferrer">
                        <span className="text-blue-500 hover:underline ml-2">
                          Preview
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </Label>
            </div>

            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              className="focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:text-white/90 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 dark:placeholder:text-gray-400"
              placeholder="choose file"
              id="upload_multiple_img"
              {...register("upload_multiple_img", {
                onChange: fileSelectedHandler,
              })}
              multiple
            />

            {typeof errors.upload_multiple_img?.message === "string" && (
              <p className="error">{errors.upload_multiple_img.message}</p>
            )}
          </div>

          <div className="col-span-12 md:col-span-4"></div>

          {/* Short Description (English) */}
          <div className="col-span-12 md:col-span-6">
            <Label>
              Short Description (English){" "}
              <span className="text-red-500">*</span>
            </Label>
            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded p-2 h-22 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="short_descr_english"
              placeholder="Enter short description in english"
              {...register("short_descr_english")}
            />
            {typeof errors.short_descr_english?.message === "string" && (
              <p className="error">{errors.short_descr_english.message}</p>
            )}
          </div>

          {/* Short Description (Hindi) */}
          <div className="col-span-12 md:col-span-6">
            <Label>
              Short Description (Hindi) <span className="text-red-500">*</span>
            </Label>

            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded p-2 h-22 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="short_descr_hindi"
              placeholder="Enter short description in hindi"
              {...register("short_descr_hindi")}
            />
            {typeof errors.short_descr_hindi?.message === "string" && (
              <p className="error">{errors.short_descr_hindi.message}</p>
            )}
          </div>

          {/* Upload Brochures */}
          <div className="col-span-12 md:col-span-6">
            <Label>
              Upload Brochure (English) <span className="text-red-500">*</span>{" "}
              <span className="text-red-500">(Recommended : Max 5MB)</span>
              {!isEdit}
              {enBrouchPreview && (
                <Link
                  to={enBrouchPreview}
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
              accept=".mov,.pdf,.doc,.docx"
              className="focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:text-white/90 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 dark:placeholder:text-gray-400"
              placeholder="choose file"
              id="upload_brouch_english"
              {...register("upload_brouch_english")}
            />

            {typeof errors.upload_brouch_english?.message === "string" && (
              <p className="error">{errors.upload_brouch_english.message}</p>
            )}
          </div>

          <div className="col-span-12 md:col-span-6">
            <Label>
              Upload Brochure (Hindi) <span className="text-red-500">*</span>{" "}
              <span className="text-red-500">(Recommended : Max 5MB)</span>
              {!isEdit}
              {hiBrouchPreview && (
                <Link
                  to={hiBrouchPreview}
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
              accept=".mov,.pdf,.doc,.docx"
              className="focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:text-white/90 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 dark:placeholder:text-gray-400"
              placeholder="choose file"
              id="upload_brouch_hindi"
              {...register("upload_brouch_hindi")}
            />

            {typeof errors.upload_brouch_hindi?.message === "string" && (
              <p className="error">{errors.upload_brouch_hindi.message}</p>
            )}
          </div>

          {/* Descriptions with Summernote */}
          <div className="col-span-12 md:col-span-6">
            <Label>
              Description (English) <span className="text-red-500">*</span>
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
              Description (Hindi) <span className="text-red-500">*</span>
            </Label>
            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded p-2 h-22 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="descr_hindi"
              // value={descr_english}
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
