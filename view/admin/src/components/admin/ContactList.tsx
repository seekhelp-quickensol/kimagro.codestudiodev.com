import React, { useEffect, useState } from "react";
import { TableColumn } from "react-data-table-component";

import CustomDataTable from "../../components/ui/table/customTableComponent";
import { deleteItem } from "../../components/services/commonApi";
import { FaTrash } from "react-icons/fa";
import Label from "../../components/form/Label";
import toast from "react-hot-toast";
import { useModal } from "../../hooks/useModal";
// import Label from "../../components/form/Label";
import Swal from "sweetalert2";
// type StatusFilter = "all" | "1" | "0";

interface ServiceRow {
  0: number;
  1: number;
  2: string;
  3: number | string;
  4: string; // Email
  5: string; // Company Name
  6: string; // Title
  7: string; // Message
  8: string; // Status (0 or 1)
}

interface ApiResponse {
  data: {
    success: boolean;
    message: string;
  };
}

const ContactList: React.FC = () => {
  const [refresh, setRefresh] = useState(false);

  const [filteredName, setFilteredName] = useState<string>("");
  const [filteredMobile, setFilteredMobile] = useState<string>("");
  const [filteredUrl, setFilteredUrl] = useState<string>(
    "/api/contact/ajax/contact-list"
  );
  const {
    isOpen: isMessageOpen,
    openModal: openMessageModal,
    closeModal: closeMessageModal,
  } = useModal();
  const [selectedItem, setSelectedItem] = useState<ServiceRow | null>(null);

  useEffect(() => {
    if (filteredName === "" && filteredMobile === "") {
      setFilteredUrl("/api/contact/ajax/contact-list");
    } else {
      setFilteredUrl(
        `/api/contact/ajax/contact-list?name=${filteredName}&mobile=${filteredMobile}`
      );
    }
  }, [filteredName, filteredMobile]);

  const columns: TableColumn<ServiceRow>[] = [
    {
      name: "Sr.No",
      selector: (row: ServiceRow) => row[0],
    },
    {
      name: "Name",
      selector: (row: ServiceRow) => row[2],
    },
    {
      name: "Mobile No.",
      selector: (row: ServiceRow) => row[3],
    },
    {
      name: "Email",
      selector: (row: ServiceRow) => row[4],
    },
    {
      name: "Company Name",
      selector: (row: ServiceRow) => row[5],
    },

    {
      name: "Job Title",
      selector: (row: ServiceRow) => row[6],
    },
    {
      name: "Message",
      cell: (row: ServiceRow) => (
        <button
          className="text-blue-600 underline"
          onClick={() => {
            setSelectedItem(row);
            openMessageModal();
          }}>
          View
        </button>
      ),
    },
    {
      name: "Actions",
      cell: (row: ServiceRow) => (
        <div className="flex justify-center gap-7 items-center w-full pe-[30px]">
          <button
            onClick={() => handleDelete(row[1])}
            title="Delete"
            className="text-red-600 hover:text-red-800">
            <FaTrash size={15} />
          </button>
        </div>
      ),

      ignoreRowClick: true,
      button: true,
    },
  ];

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
        const response: ApiResponse = await deleteItem("tbl_contact_form", id);
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
      <div className="filter-container flex items-center mb-4">
        <div className="w-full md:w-1/3 pe-4 mb-4">
          <Label className="mb-2">Search By Name</Label>
          <input
            type="text"
            value={filteredName}
            onChange={(e) => setFilteredName(e.target.value)}
            className="h-11 w-full appearance-none rounded-lg border px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-1"
            placeholder="Enter Name"
          />
        </div>
        <div className="w-full md:w-1/3 pe-4 mb-4">
          <Label className="mb-2">Search By Mobile No.</Label>
          <input
            type="text"
            value={filteredMobile}
            onChange={(e) => setFilteredMobile(e.target.value)}
            className="h-11 w-full appearance-none rounded-lg border px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-1"
            placeholder="Enter Mobile No."
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
      {isMessageOpen && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Enquiry Message</h2>

            <div className="mb-4">
              <strong>Message:</strong> {selectedItem[7]}
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={closeMessageModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactList;
