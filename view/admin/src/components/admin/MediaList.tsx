import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { TableColumn } from "react-data-table-component";
import CustomDataTable from "../../components/ui/table/customTableComponent";
import {
  activateItem,
  deactivateItem,
  deleteItem,
} from "../../components/services/commonApi";
import Label from "../../components/form/Label";
import toast from "react-hot-toast";
import { CheckLineIcon, CloseLineIcon } from "../../icons";
import Swal from "sweetalert2";

interface mediaModCol {
  0: number;
  1: number; //id
  2: string; //media_type
  3: string; //media_category_id
  4: string; //name_english
  5: string; // media_category
  6: string; //upload_photo
  7: string; //upload_video
  8: string; //descr_english
  9: string; //descr_hindi
  10: number | string; //status
  11: string; //status
}

interface ApiResponse {
  data: {
    success: boolean;
    message: string;
  };
}

// type StatusFilter = "all" | "1" | "0";

type typeFilter = "all" | "photos" | "videos" | "news";

const MediaList: React.FC = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedMedia, setSelectedProduct] = useState<mediaModCol | null>(
    null
  );
  const [refresh, setRefresh] = useState(false);

  type ModalType = "upload_photo" | "upload_video";

  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [filteredCategoryName, setFilteredCategoryName] = useState<string>("");

  const navigate = useNavigate();

  const openModal = (product: mediaModCol, type: ModalType) => {
    setSelectedProduct(product);

    setModalType(type);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedProduct(null);
    setModalType(null);
  };
  // const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<typeFilter>("all");
  const [filteredUrl, setFilteredUrl] = useState<string>(
    "/api/medmodules/ajax/media-list"
  );

  useEffect(() => {
    if (typeFilter === "all" && filteredCategoryName === "") {
      setFilteredUrl("/api/medmodules/ajax/media-list");
    } else {
      setFilteredUrl(
        `/api/medmodules/ajax/media-list?media_type=${typeFilter}&category_name=${filteredCategoryName}`
      );
    }
  }, [typeFilter, filteredCategoryName]);

  const columns: TableColumn<mediaModCol>[] = [
    {
      name: "Sr. No.",
      selector: (row: mediaModCol) => row[0],
      width: "80px",
    },
    {
      name: "Media Category Type",
      selector: (row: mediaModCol) => row[2],
    },
    {
      name: "Category Name (English)",
      selector: (row: mediaModCol) => row[4],
    },
    {
      name: "Image",
      cell: (row: mediaModCol) =>
        row[6] ? (
          <button
            className="text-blue-600 underline"
            onClick={() => openModal(row, "upload_photo")}>
            View
          </button>
        ) : (
          "-"
        ),
    },
    {
      name: "Video",
      cell: (row: mediaModCol) =>
        row[7] ? (
          <button
            className="text-blue-600 hover:text-blue-800 underline"
            onClick={() => openModal(row, "upload_video")}>
            View
          </button>
        ) : (
          "-"
        ),
    },
    {
      name: "Status",
      selector: (row: mediaModCol) => row[10],
      cell: (row: mediaModCol) => (row[10] === "1" ? "Active" : "Inactive"),
    },
    {
      name: "Actions",
      cell: (row: mediaModCol) => (
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
            onClick={() => handleToggleStatus(row[1], row[10])}
            className="btn btn-sm btn-info text-[17px]">
            {row[10] === "1" ? <CheckLineIcon /> : <CloseLineIcon />}
          </button>
        </div>
      ),
      width: "250px",
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
        response = await deactivateItem("tbl_media", id);
      } else {
        response = await activateItem("tbl_media", id);
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
    navigate("/add-media/" + id);
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
        const response: ApiResponse = await deleteItem("tbl_media", id);
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

  const handleTypeFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setTypeFilter(e.target.value as typeFilter);
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <div className="filter-container flex flex-wrap mb-4 gap-4">
        <div className="w-full md:w-1/3 lg:w-1/3 mb-4 md:mb-0">
          <Label className="mb-2"> Filter by Media Type</Label>
          <select
            className="h-11 w-full appearance-none rounded-lg border px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-1"
            value={typeFilter}
            onChange={handleTypeFilterChange}>
            <option value="all">All Media Type</option>
            <option value="photos">Photos</option>
            <option value="videos">Videos</option>
            <option value="news">News</option>
          </select>
        </div>

        <div className="w-full md:w-1/3 lg:w-1/3 mb-4 md:mb-0">
          <Label className="mb-2"> Filter by Category Name</Label>
          <input
            type="text"
            className="h-11 w-full appearance-none rounded-lg border px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-1"
            placeholder="Enter Category Name"
            value={filteredCategoryName}
            onChange={(e) => setFilteredCategoryName(e.target.value)}
          />
        </div>
      </div>
      <hr className="my-8" />
      <div className="table-container">
        <CustomDataTable
          tableName="Product"
          url={filteredUrl}
          columns={columns}
          refresh={refresh}
        />
      </div>
      {modalIsOpen && selectedMedia && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            {modalType === "upload_photo" && selectedMedia[6] && (
              <img
                src={`${import.meta.env.VITE_APP_API_URL}/uploads/images/${
                  selectedMedia[6]
                }`}
                alt="Media"
                className="mx-auto rounded mb-2"
              />
            )}

            {modalType === "upload_video" && selectedMedia[7] && (
              <video
                src={`${import.meta.env.VITE_APP_API_URL}/uploads/videos/${
                  selectedMedia[7]
                }`}
                controls
                className="mb-4 w-full h-64 object-cover rounded"
              />
            )}

            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaList;
