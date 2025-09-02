import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import Swal from "sweetalert2";

import {
  activateItem,
  deactivateItem,
  deleteItem,
} from "../../components/services/commonApi";
import { FaEdit, FaTrash } from "react-icons/fa";
import CustomDataTable from "../../components/ui/table/customTableComponent";
import { TableColumn } from "react-data-table-component";
import Label from "../../components/form/Label";
import toast from "react-hot-toast";
import { CheckLineIcon, CloseLineIcon } from "../../icons";

Modal.setAppElement("#root");

type FilterSearch = string;

interface ProductCategoryCol {
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
interface CategoryListProps {
  refresh: boolean;
  setRefresh: (value: boolean) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  refresh,
  setRefresh,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
 

  const [filterSearch, setFilterSearch] = useState<FilterSearch>("");
  const [filteredUrl, setFilteredUrl] = useState<string>(
    "/api/categories/ajax/category-list"
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (filterSearch === "all") {
      setFilteredUrl("/api/categories/ajax/category-list");
    } else {
      setFilteredUrl(
        `/api/categories/ajax/category-list?search=${filterSearch}`
      );
    }
  }, [filterSearch]);

  const columns: TableColumn<ProductCategoryCol>[] = [
    {
      name: "Sr. No.",
      selector: (row: ProductCategoryCol) => row[0],
      
    },
    {
      name: "Category Name (English)",
      selector: (row: ProductCategoryCol) => row[2],
      
    },
    {
      name: "Category Name (Hindi)",
      selector: (row: ProductCategoryCol) => row[3],
      
    },
    {
      name: "Image",
      cell: (row: ProductCategoryCol) => (
        <button
          className="text-blue-600 underline"
          onClick={() => openImageModal(row[4])}>
          View
        </button>
      ),
      
    },
    {
      name: "Status",
      selector: (row: ProductCategoryCol) => row[5],
      cell: (row: ProductCategoryCol) =>
        row[5] === "1" ? "Active" : "Inactive",
      
    },
    {
      name: "Actions",
      cell: (row: ProductCategoryCol) => (
        <div className="flex justify-center gap-7 items-center w-full pe-[30px]">
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
            className="btn btn-sm btn-info text-[17px]"
          >
            {row[5] === "1" ? <CheckLineIcon /> :  <CloseLineIcon/>}
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
        response = await deactivateItem("tbl_category_master", id);
      } else {
        response = await activateItem("tbl_category_master", id);
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
    navigate("/add-category/" + id);
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
    
      const response: ApiResponse = await deleteItem("tbl_category_master", id);
      if (response.data.success) {
        toast.success(` ${response.data.message}`);
        setRefresh(!refresh);
      } else {
        toast.success(`Error: ${response.data.message}`);
      }
    }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error(" Failed to delete item");
    }
  };
  const openImageModal = (imageUrl: string) => {
    setSelectedImage(
      `${import.meta.env.VITE_APP_API_URL}/uploads/images/${imageUrl}`
    );
    setModalIsOpen(true);
  };

  const handleFilterSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setFilterSearch(e.target.value as FilterSearch);
  };

  return (
    <>
      <div className="filter-container row">
        <div className="col-md-4 mb-3">
          <Label>Search Category Name</Label>
          <input
            type="text"
            placeholder="Search Category Name..."
            className="h-11 w-full md:w-1/3 ps-4 appearance-none rounded-lg border px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-1"
            value={filterSearch}
            onChange={(e) => handleFilterSearchChange(e)}
          />
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

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Image Preview"
        className="p-6 bg-white rounded-lg max-w-lg mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-gray-900/50 flex justify-center items-center">
        <img
          src={selectedImage}
          alt="Category"
          className="mx-auto rounded"
        />
        <button
          onClick={() => setModalIsOpen(false)}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded">
          Close
        </button>
      </Modal>
    </>
  );
};

export default CategoryList;
