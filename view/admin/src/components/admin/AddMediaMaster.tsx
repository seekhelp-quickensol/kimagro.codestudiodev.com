import { useState, useEffect } from "react";
import ComponentCard from "./../common/ComponentCard";
import Label from "../form/Label";
import { mediaSchema } from "../../validations/validationSchema";
import { getMediaById, submitMediaForm } from "../services/serviceApi";
import { useForm } from "react-hook-form";
import ControlledSelect from "../form/ControlledSelect";
import NewInput from "../form/input/NewInputField";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import CustomDataTable from "../../components/ui/table/customTableComponent";
import { TableColumn } from "react-data-table-component";
import {
  activateItem,
  deactivateItem,
  deleteItem,
} from "../../components/services/commonApi";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { CheckLineIcon, CloseLineIcon } from "../../icons";
import Swal from "sweetalert2";

interface mediaFormValues {
  media_category: string;
  name_english: string;
  name_hindi: string;
}

// type StatusFilter = "all" | "1" | "0";

type MediaFilter = "all" | "photos" | "videos" | "news";

interface MediaCategoryCol {
  0: number;
  1: number;
  2: string;
  3: string;
  4: string;
  5: number | string;
}

interface ApiResponse {
  data: {
    success: boolean;
    message: string;
  };
}

export default function MediaMasterPage() {
  const [title,setTitle] = useState<string>("Add media category");
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>("all");
  const [filteredUrl, setFilteredUrl] = useState<string>(
    "/api/medias/ajax/media-list"
  );
  const navigate = useNavigate();
  const capitalize = (str: string): string =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  
  useEffect(() => {
    if (mediaFilter === "all") {
      setFilteredUrl("/api/medias/ajax/media-list");
    } else {
      setFilteredUrl(
        `/api/medias/ajax/media-list?media_category=${mediaFilter}`
      );
    }
  }, [mediaFilter]);

  const columns: TableColumn<MediaCategoryCol>[] = [
    {
      name: "Sr. No.",
      selector: (row: MediaCategoryCol) => row[0],
      
    },
    {
      name: "Media Category",
      selector: (row: MediaCategoryCol) => capitalize(row[2]),
     
    },
    {
      name: "Category Name (English)",
      selector: (row: MediaCategoryCol) => row[3],
     
    },
    {
      name: "Category Name (Hindi)",
      selector: (row: MediaCategoryCol) => row[4],
     
    },
    {
      name: "Status",
      selector: (row: MediaCategoryCol) => row[5],
      cell: (row: MediaCategoryCol) => (row[5] === "1" ? "Active" : "Inactive"),
     
    },
    {
      name: "Actions",
      cell: (row: MediaCategoryCol) => (
        <div className="flex justify-center gap-7 items-center w-full">
          <button
            onClick={() => handleEdit(row[1])}
            title="Edit"
            className="text-green-600 hover:text-green-800">
            <FaEdit size={15} />
          </button>
          <button
            onClick={() => handleDelete(row[1])}
            title="Delete"
            className="text-red-600 hover:text-red-800">
            <FaTrash size={15} />
          </button>
          <button
            onClick={() => handleToggleStatus(row[1], row[5])}
            className="btn btn-sm btn-info text-[16px]"
             >
           
              {row[5] === "1" ? <CheckLineIcon  /> :  <CloseLineIcon/>}
          </button>
        </div>
      ),
     
      ignoreRowClick: true,
      button: true,
    },
  ];

  const handleToggleStatus = async (
    id: number,
    currentStatus: string | number
  ): Promise<void> => {
    try {
      let response: ApiResponse;
      if (currentStatus === "1") {
        response = await deactivateItem("tbl_media_master", id);
      } else {
        response = await activateItem("tbl_media_master", id);
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
    navigate("/add-media-master/" + id);
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action will permanently delete the item.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });
    
      if (result.isConfirmed) {
    
      const response: ApiResponse = await deleteItem("tbl_media_master", id);
      if (response.data.success) {
        toast.success(` ${response.data.message}`);
        setRefresh(!refresh);
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error(" Failed to delete item");
    }
  };

  // const handleStatusFilterChange = (
  //   e: React.ChangeEvent<HTMLSelectElement>
  // ): void => {
  //   setStatusFilter(e.target.value as StatusFilter);
  // };

  const handleMediaFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setMediaFilter(e.target.value as MediaFilter);
  };

  const options = [
    { value: "", label: "Select Media Type" },
    { value: "photos", label: "Photos" },
    { value: "videos", label: "Videos" },
    { value: "news", label: "News" },
  ];

  const [refresh, setRefresh] = useState(false);

  const { id } = useParams();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(mediaSchema),
  });

  const resetForm = () => {
    reset({
      media_category: "",
      name_english: "",
      name_hindi: "",
    });
  };

  const onSubmit = async (data: mediaFormValues) => {
    try {
      const formData = new FormData();
      formData.append("name_english", data.name_english);
      formData.append("name_hindi", data.name_hindi);
      formData.append("media_category", data.media_category);

      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const method = id ? "put" : "post";
      const response = await submitMediaForm(id ?? null, formData, method);
      const { success, message } = response.data;
      success
        ? toast.success(`${message}`)
        : toast.error(`Error: ${message}`);

      if (success) {
        resetForm();
        navigate("/add-media-master");
        setRefresh(!refresh);
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

      toast.error(`Error: ${msg}`);
    } finally {
    }
  };
  useEffect(() => {
    if (id) {
      setTitle("Update media category");
      getMediaById(id)
        .then((res) => {
          const data = res.data.data;
          reset({
            media_category: data.media_category,
            name_english: data.name_english,
            name_hindi: data.name_hindi,
          });
        })
        .catch(() => toast.error("Error fetching media data"));
    }
    else{
      setTitle("Add media category");
    }
  }, [id, reset]);

  return (
    <div className="space-y-6">
      <ComponentCard title="Media Master" desc={title}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          name="add_sku_form"
          id="add_sku_form">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4 relative">
              <Label>
                Media Type<span className="text-red-500">*</span>
              </Label>
              <ControlledSelect
                name="media_category"
                control={control}
                errors={errors}
                options={options}
                placeholder="Select Media Type"
              />
            </div>
            <div className="col-span-12 md:col-span-4">
              <Label>
                Category Name (English)<span className="text-red-500">*</span>
              </Label>
              <NewInput
                name="name_english"
                type="text"
                placeholder="Enter title in english"
                className="w-full"
                register={register}
                errors={errors}
              />
            </div>
            <div className="col-span-12 md:col-span-4">
              <Label>
                Category Name (Hindi)<span className="text-red-500">*</span>
              </Label>
              <NewInput
                name="name_hindi"
                type="text"
                placeholder="Enter title in hindi"
                className="w-full"
                register={register}
                errors={errors}
              />
            </div>
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
        <div className="filter-container flex flex-wrap items-center">
          <div className="w-full md:w-1/3 pe-4">
            <Label className="mb-2">Filter by Media Type</Label>
            <select
              className="h-11 w-full appearance-none rounded-lg border px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-1"
              value={mediaFilter}
              onChange={handleMediaFilterChange}
              style={{ width: "200px", marginBottom: "16px" }}>
              <option value="all">All Media Type</option>
              <option value="photos">Photos</option>
              <option value="videos">Videos</option>
              <option value="news">News</option>
            </select>
          </div>
        </div>
        <hr className="my-8" />
        <div className="table-container">
          <CustomDataTable
            tableName="Service"
            url={filteredUrl}
            columns={columns}
            refresh={refresh}
          />
        </div>
      </div>
    </div>
  );
}
