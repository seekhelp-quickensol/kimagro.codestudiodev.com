import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import { TableColumn } from "react-data-table-component";
import CustomDataTable from "../../components/ui/table/customTableComponent";
import {
  activateItem,
  deactivateItem,
  deleteItem,
} from "../../components/services/commonApi";
import { getAllSKUSOption } from "../services/serviceApi";
import Label from "../../components/form/Label";
import toast from "react-hot-toast";
import { CheckLineIcon, CloseLineIcon } from "../../icons";
import Swal from "sweetalert2";
// type StatusFilter = "all" | "1" | "0";

interface ProductCol {
  0: number;
  1: number; //id
  2: number; // product_category_id
  3: string; //product_name_english
  4: string; //product_name_hindi
  5: string; //product_img
  6: string; // product_title_english
  7: string; //product_title_hindi
  8: string; //sku_id
  9: string; // skuDetails
  10: string; // (optional: can be removed if unused)

  11: string[]; //upload_multiple_img
  12: string; //short_descr_english
  13: string; //short_descr_hindi
  14: string; //upload_brouch_english
  15: string; //upload_brouch_hindi
  16: string; //descr_english
  17: string; //descr_hindi
  18: number | string; //status
  19: string; //product_tag_english
  20: string; //product_tag_hindi
}

interface ApiResponse {
  data: {
    success: boolean;
    message: string;
  };
}

type UnitOption = {
  value: string; // Use string because "all" is a string
  label: string;
};

const ProductList: React.FC = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductCol | null>(
    null
  );
  type ModalType =
    | "product_img"
    | "short_descr_english"
    | "short_descr_hindi"
    | "upload_multiple_img";
  const [modalType, setModalType] = useState<ModalType | null>(null);

  const openModal = (product: ProductCol, type: ModalType) => {
    setSelectedProduct(product);
    setModalType(type);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedProduct(null);
    setModalType(null);
  };

  const checkInnovationByProductId = async (
    productId: number
  ): Promise<number | null> => {
    try {
      const response = await axios.get(
        `/api/innovations/innovation-by-product/${productId}`
      );

      if (response.data.success && response.data.data?.id) {
        return response.data.data.id;
      }

      return null;
    } catch (error) {
      console.error("Error checking innovation:", error);
      return null;
    }
  };

  // const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [unitOptions, setUnitOptions] = useState<UnitOption[]>([]);
  const [unitFilter, setUnitFilter] = useState<string>("all");
  const [productNameFilter, setProductNameFilter] = useState<string>("");
  const [filteredUrl, setFilteredUrl] = useState<string>(
    "/api/products/ajax/product-list"
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnits = async () => {
      const response = await getAllSKUSOption();

      const unitData = response.data.data;
      console.log("Unit API response:", response.data);

      setUnitOptions([
        { value: "all", label: "All Unit" },
        ...unitData.map((dept: any) => ({
          value: dept.id.toString(),
          label: dept.unit,
        })),
      ]);
    };

    fetchUnits();
  }, []);

  useEffect(() => {
    if (unitFilter === "all" && productNameFilter === "") {
      setFilteredUrl("/api/products/ajax/product-list");
    } else {
      setFilteredUrl(
        `/api/products/ajax/product-list?sku_id=${unitFilter}&product_name=${productNameFilter}`
      );
    }
  }, [unitFilter, productNameFilter]);

  const handleUnitFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setUnitFilter(e.target.value);
  };

  const columns: TableColumn<ProductCol>[] = [
    {
      name: "Sr. No.",
      selector: (row: ProductCol) => row[0],
      width: "80px",
    },
    {
      name: "Product Name (English)",
      selector: (row: ProductCol) => row[3],
    },
    {
      name: "Product Name (Hindi)",
      selector: (row: ProductCol) => row[4],
    },
    {
      name: "Product Tag (English)",
      selector: (row: ProductCol) =>
        Array.isArray(row[19]) ? row[19].join(", ") : row[19] || "-",
    },
    {
      name: "Product Tag (Hindi)",
      selector: (row: ProductCol) =>
        Array.isArray(row[20]) ? row[20].join(", ") : row[20] || "-",
    },

    {
      name: "Image",
      cell: (row: ProductCol) => (
        <button
          className="text-blue-600 underline"
          onClick={() => openModal(row, "product_img")}>
          View
        </button>
      ),
    },
    {
      name: "Title (English)",
      selector: (row: ProductCol) => row[6],
    },
    {
      name: "Title (Hindi)",
      selector: (row: ProductCol) => row[7],
    },
    {
      name: "SKU Unit",
      selector: (row: ProductCol) => row[9],
    },

    {
      name: "Short Desc (English)",
      cell: (row: ProductCol) => (
        <button
          className="text-blue-600 underline"
          onClick={() => openModal(row, "short_descr_english")}>
          View
        </button>
      ),
    },
    {
      name: "Short Desc (Hindi)",
      cell: (row: ProductCol) => (
        <button
          className="text-blue-600 underline"
          onClick={() => openModal(row, "short_descr_hindi")}>
          View
        </button>
      ),
    },
    {
      name: "Brochure (English)",
      cell: (row: ProductCol) => (
        <a
          href={`${import.meta.env.VITE_APP_API_URL}/uploads/brochures/${
            row[14]
          }`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline">
          View
        </a>
      ),
    },
    {
      name: "Brochure (Hindi)",
      cell: (row: ProductCol) => (
        <a
          href={`${import.meta.env.VITE_APP_API_URL}/uploads/brochures/${
            row[15]
          }`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline">
          View
        </a>
      ),
    },
    {
      name: "Multiple Images",
      cell: (row: ProductCol) => (
        <button
          className="text-blue-600 underline"
          onClick={() => openModal(row, "upload_multiple_img")}>
          View
        </button>
      ),
    },
    {
      name: "Status",
      selector: (row: ProductCol) => row[18],
      cell: (row: ProductCol) => (row[18] === "1" ? "Active" : "Inactive"),
    },
    {
      name: "Actions",
      cell: (row: ProductCol) => (
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
            onClick={() => handleToggleStatus(row[1], row[18])}
            className="btn btn-sm btn-info text-[17px]">
            {row[18] === "1" ? <CheckLineIcon /> : <CloseLineIcon />}
          </button>

          <button
            title="Innovation"
            className="flex items-center px-1 py-1 bg-green-100 text-yellow-700 rounded hover:bg-green-200 transition whitespace-nowrap"
            onClick={async () => {
              const innovationId = await checkInnovationByProductId(row[1]);
              if (innovationId) {
                navigate(`/add-innovation/${row[1]}/` + innovationId);
              } else {
                navigate(`/add-innovation/${row[1]}`);
              }
            }}>
            Innovation
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
        response = await deactivateItem("tbl_product", id);
      } else {
        response = await activateItem("tbl_product", id);
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
    navigate("/add-product/" + id);
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
        const response: ApiResponse = await deleteItem("tbl_product", id);
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

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <div className="filter-container flex flex-wrap gap-4">
        <div className="w-full md:w-1/3 pe-4 relative">
          <Label className="mb-2">Filter by SKU Unit</Label>
          <select
            className="h-11 w-full appearance-none rounded-lg border px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-1"
            value={unitFilter}
            onChange={handleUnitFilterChange}>
            {unitOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="icon-container icon-container-2" aria-hidden="true"><svg height="20" width="20" fill=" hsl(0, 0%, 80%)" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="css-tj5bde-Svg"><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg></div>
          {/* <div className="pointer-events-none absolute right-10 top-10 flex items-center text-gray-500">
            ▼
          </div> */}
        </div>
        <div className="w-full md:w-1/3 pe-4">
          <Label className="mb-2">Search Product Name</Label>
          <input
            type="text"
            placeholder="Search Product Name..."
            className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-1  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
            onChange={(e) => {
              setProductNameFilter(e.target.value);
            }}
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
      {modalIsOpen && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            {modalType === "product_img" && selectedProduct[5] && (
              <img
                src={`${import.meta.env.VITE_APP_API_URL}/uploads/images/${
                  selectedProduct[5]
                }`}
                alt="Product"
                className="mx-auto rounded mb-2"
              />
            )}

            {(modalType === "short_descr_english" ||
              modalType === "short_descr_hindi") && (
              <div>
                <strong>
                  {modalType === "short_descr_english"
                    ? "Short Description (English):"
                    : "Short Description (Hindi):"}
                </strong>
                <p className="mt-2 whitespace-pre-line">
                  {modalType === "short_descr_english"
                    ? selectedProduct[12]
                    : selectedProduct[13]}
                </p>
              </div>
            )}

            {modalType === "upload_multiple_img" &&
              Array.isArray(selectedProduct[11]) &&
              selectedProduct[11].length > 0 && (
                <div>
                  <strong>Multiple Images:</strong>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {selectedProduct[11].map((img, idx) => (
                      <img
                        key={idx}
                        src={`${
                          import.meta.env.VITE_APP_API_URL
                        }/uploads/images/${img}`}
                        alt={`Product Img ${idx + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                    ))}
                  </div>
                </div>
              )}

            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
