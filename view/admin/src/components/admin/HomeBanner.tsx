import ComponentCard from "./../common/ComponentCard";
import Label from "../form/Label";
import { bannerSchema } from "../../validations/validationSchema";
import { getBannerById, submitBannerForm } from "../services/serviceApi";
import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import NewInput from "../form/input/NewInputField";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams, Link } from "react-router-dom";
import useFetchBannerById from "../../hooks/useBannerById";
import CustomDataTable from "../../components/ui/table/customTableComponent";
import { TableColumn } from "react-data-table-component";
import {
  activateItem,
  deactivateItem,
} from "../../components/services/commonApi";
import toast from "react-hot-toast";
import { CheckLineIcon, CloseLineIcon } from "../../icons";

interface BannerFormData {
  title_english: string;
  title_hindi: string;
  sub_title_english: string;
  sub_title_hindi: string;
  descr_english: string;
  descr_hindi: string;
  upload_video?: FileList | null | undefined;
}

type StatusFilter = "all" | "1" | "0";

interface HomeBannerCol {
  0: number;
  1: number;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: number | string;
}

interface ApiResponse {
  data: {
    success: boolean;
    message: string;
  };
}

export default function HomeBannerForm() {
  const [refresh, setRefresh] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  Modal.setAppElement("#root");

  const navigate = useNavigate();

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const [selectedVideo, setSelectedVideo] = useState<string>("");

  const isEdit = !!id;

  const openVideoModal = (videoFileName: string) => {
    setSelectedVideo(
      `${import.meta.env.VITE_APP_API_URL}/uploads/videos/${videoFileName}`
    );
    setModalIsOpen(true);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(bannerSchema(isEdit)),
    defaultValues: {
      title_english: "",
      title_hindi: "",
      sub_title_english: "",
      sub_title_hindi: "",
      descr_english: "",
      descr_hindi: "",
      upload_video: null,
    },
  });

  const resetForm = () => {
    reset({
      title_english: "",
      title_hindi: "",
      sub_title_english: "",
      sub_title_hindi: "",
      descr_english: "",
      descr_hindi: "",
      upload_video: null,
    });
    setImagePreview("");
  };

  useFetchBannerById(reset);

  useEffect(() => {
    if (id) {
      getBannerById(id)
        .then((res) => {
          const data = res.data.data;

          reset({
            title_english: data.title_english,
            title_hindi: data.title_hindi,
            sub_title_english: data.sub_title_english,
            sub_title_hindi: data.sub_title_hindi,
            descr_english: data.descr_english,
            descr_hindi: data.descr_hindi,
          });

          setImagePreview(
            `${import.meta.env.VITE_APP_API_URL}/uploads/videos/${
              data.upload_video
            }`
          );
        })
        .catch(() => toast.error("Error fetching product data"));
    }
  }, [id, reset]);

  const onSubmit = async (data: BannerFormData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title_english", data.title_english);
      formData.append("title_hindi", data.title_hindi);
      formData.append("sub_title_english", data.sub_title_english);
      formData.append("sub_title_hindi", data.sub_title_hindi);
      formData.append("descr_english", data.descr_english);
      formData.append("descr_hindi", data.descr_hindi);
      if (data.upload_video?.length) {
        formData.append("upload_video", data.upload_video[0]);
      }

      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const method = id ? "put" : "post";
      const response = await submitBannerForm(id ?? null, formData, method);
      const { success, message } = response.data;
      success ? toast.success(`${message}`) : toast.error(`Error: ${message}`);
      if (success) {
        resetForm();
        navigate("/home-banner");
        setRefresh(!refresh);
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
      console.log(msg);
    } finally {
      setLoading(false);
    }
  };

  const [statusFilter] = useState<StatusFilter>("all");
  const [filteredUrl, setFilteredUrl] = useState<string>(
    "/api/banners/ajax/banner-list"
  );

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredUrl("/api/banners/ajax/banner-list");
    } else {
      setFilteredUrl(`/api/banners/ajax/banner-list?status=${statusFilter}`);
    }
  }, [statusFilter]);

  const columns: TableColumn<HomeBannerCol>[] = [
    {
      name: "Sr. No.",
      selector: (row: HomeBannerCol) => row[0],
      grow: 0,
      minWidth: "80px",
    },
    {
      name: "Title English",
      selector: (row: HomeBannerCol) => row[2],
      grow: 0,
      minWidth: "150px",
    },
    {
      name: "Title Hindi",
      selector: (row: HomeBannerCol) => row[3],
      grow: 0,
      minWidth: "150px",
    },
    {
      name: "Sub Title English",
      selector: (row: HomeBannerCol) => row[4],
      grow: 0,
      minWidth: "170px",
    },
    {
      name: "Sub Title Hindi",
      selector: (row: HomeBannerCol) => row[5],
      grow: 0,
      minWidth: "150px",
    },
    {
      name: "Descr English",
      selector: (row: HomeBannerCol) => row[6],
      grow: 0,
      minWidth: "170px",
    },
    {
      name: "Descr Hindi",
      selector: (row: HomeBannerCol) => row[7],
      grow: 0,
      minWidth: "170px",
    },
    {
      name: "Video",
      cell: (row: HomeBannerCol) =>
        row[8] ? (
          <button
            className="text-blue-600 hover:text-blue-800 underline"
            onClick={() => openVideoModal(row[8])}>
            View
          </button>
        ) : (
          "-"
        ),
    },
    {
      name: "Status",
      selector: (row: HomeBannerCol) => row[9],
      cell: (row: HomeBannerCol) => (row[9] === "1" ? "Active" : "Inactive"),
      grow: 0,
      minWidth: "200px",
    },
    {
      name: "Actions",
      cell: (row: HomeBannerCol) => (
        <div className="flex justify-center gap-7 items-center w-full">
          <button
            onClick={() => handleEdit(row[1])}
            title="Edit"
            className="text-green-600 hover:text-green-800">
            <FaEdit size={15} />
          </button>
          <button
            onClick={() => handleToggleStatus(row[1], row[9])}
            className="btn btn-sm btn-info text-[17px] hidden">
            {row[9] === "1" ? <CheckLineIcon /> : <CloseLineIcon />}
          </button>
        </div>
      ),
      ignoreRowClick: true,
      button: true,
      grow: 0,
      minWidth: "100px",
    },
  ];

  const handleToggleStatus = async (
    id: number,
    currentStatus: string | number
  ): Promise<void> => {
    try {
      let response: ApiResponse;
      if (currentStatus === "1") {
        response = await deactivateItem("tbl_home_banner", id);
      } else {
        response = await activateItem("tbl_home_banner", id);
      }

      if (response.data.success) {
        toast.success(` ${response.data.message}`);
        setRefresh(!refresh);
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error(" Failed to update status");
    }
  };

  const handleEdit = (id: number): void => {
    navigate("/home-banner/" + id);
  };

  return (
    <div className="space-y-6">
      <ComponentCard
        title="Home Banner Form"
        desc="Add multilingual banner content with videos and images.">
        <form
          onSubmit={handleSubmit(onSubmit)}
          name="add_banner_form"
          id="add_banner_form"
          encType="multipart/form-data">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4">
              <Label>
                Title (English)<span className="text-red-500">*</span>
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

            <div className="col-span-12 md:col-span-4">
              <Label>
                Title (Hindi)<span className="text-red-500">*</span>
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
            {/* English Video */}
            <div className="col-span-12 md:col-span-4">
              <Label>
                Upload Video
                {!isEdit && <span className="text-red-500">*</span>}
                {
                  <span className="text-red-500">
                    {" "}
                    ( Recommended Format: MP4 | 1920 × 1080 px )
                  </span>
                }
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
            {/* English Sub Title */}
            <div className="col-span-12 md:col-span-4">
              <Label>
                Sub Title (English)<span className="text-red-500">*</span>
              </Label>
              <NewInput
                name="sub_title_english"
                type="text"
                placeholder="Enter sub title in english"
                className="w-full"
                register={register}
                errors={errors}
              />
            </div>
            {/* Hindi Sub Title */}
            <div className="col-span-12 md:col-span-4">
              <Label>
                Sub Title (Hindi)<span className="text-red-500">*</span>
              </Label>
              <NewInput
                name="sub_title_hindi"
                type="text"
                placeholder="Enter sub title in hindi"
                className="w-full"
                register={register}
                errors={errors}
              />
            </div>

            {/* English Description */}
            <div className="col-span-12">
              <Label>
                Description (English)<span className="text-red-500">*</span>
              </Label>
              <textarea
                rows={4}
                className="w-full rounded border border-gray-300 p-2 text-sm"
                id="descr_english"
                placeholder="Enter description in english"
                {...register("descr_english")}
              />
              {typeof errors.descr_english?.message === "string" && (
                <p className="error">{errors.descr_english.message}</p>
              )}
            </div>

            {/* Hindi Description */}
            <div className="col-span-12">
              <Label>
                Description (Hindi)<span className="text-red-500">*</span>
              </Label>
              <textarea
                rows={4}
                className="w-full rounded border border-gray-300 p-2 text-sm"
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

      <div className="p-4 bg-white rounded-xl shadow">
        <div className="table-container">
          <CustomDataTable
            tableName="Service"
            url={filteredUrl}
            columns={columns}
            refresh={refresh}
            search={false}
          />
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          contentLabel="Video Preview"
          className="p-6 bg-white rounded-lg max-w-lg mx-auto mt-20"
          overlayClassName="fixed inset-0 bg-gray-900/50 flex justify-center items-center">
          <video
            src={selectedVideo}
            controls
            className="mb-4 w-full h-64 object-cover rounded"
          />
          <button
            onClick={() => setModalIsOpen(false)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded">
            Close
          </button>
        </Modal>
      </div>
    </div>
  );
}
