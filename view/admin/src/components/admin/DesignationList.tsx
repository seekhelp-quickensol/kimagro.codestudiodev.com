import React, { useState } from "react";
import { TableColumn } from "react-data-table-component";
import Swal from "sweetalert2";

import { useNavigate } from "react-router-dom";

import CustomDataTable from "../../components/ui/table/customTableComponent";
import {
  activateItem,
  deactivateItem,
  deleteItem,
} from "../../components/services/commonApi";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { CheckLineIcon, CloseLineIcon } from "../../icons";

// type StatusFilter = "all" | "1" | "0";

interface ServiceRow {
  0: number; // S.No
  1: number; // ID
  2: string; // Designation Name
  3: number | string; // Status (0 or 1)
}

interface ApiResponse {
  data: {
    success: boolean;
    message: string;
  };
}


interface DesignationListProps {
  refresh: boolean;
  setRefresh: (value: boolean) => void;
  
}

const DesignationList: React.FC<DesignationListProps> = ({
  refresh,
  setRefresh,
  
}) => {
  
  const [filteredUrl] = useState<string>(
    "/api/designation/ajax/designation-list"
  );
  const navigate = useNavigate();

  

  const columns: TableColumn<ServiceRow>[] = [
    {
      name: "Sr. No.",
      selector: (row: ServiceRow) => row[0],
      
    },
    {
      name: "Designation Name",
      selector: (row: ServiceRow) => row[2],
      
    },
    {
      name: "Status",
      selector: (row: ServiceRow) => row[3],
      cell: (row: ServiceRow) => (row[3] === "1" ? "Active" : "Inactive"),
      
    },
    {
      name: "Actions",
      cell: (row: ServiceRow) => (
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
            onClick={() => handleToggleStatus(row[1], row[3])}
            className="btn btn-sm btn-info text-[17px]"
          >
            {row[3] === "1" ? <CheckLineIcon /> :  <CloseLineIcon/>}
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
        response = await deactivateItem("tbl_designation", id);
      } else {
        response = await activateItem("tbl_designation", id);
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
    navigate("/designation-master/" + id);
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
    
      const response: ApiResponse = await deleteItem("tbl_designation", id);
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
    <>
      
      <div className="table-container">
        <CustomDataTable
          tableName="Designation"
          url={filteredUrl}
          columns={columns}
          refresh={refresh}
         

        />
      </div>
    </>
  );
};

export default DesignationList;
