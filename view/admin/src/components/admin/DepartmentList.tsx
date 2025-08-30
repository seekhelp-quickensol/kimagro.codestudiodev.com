import React, { useState } from "react";
import { TableColumn } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import CustomDataTable from "../../components/ui/table/customTableComponent";
import {
  activateItem,
  deactivateItem,
  deleteItem,
} from "../../components/services/commonApi";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import {  CheckLineIcon, CloseLineIcon } from "../../icons";
import Swal from "sweetalert2";

// import Label from "../../components/form/Label";

// type StatusFilter = "all" | "1" | "0";

interface ServiceRow {
  0: number;
  1: number;
  2: string;
  3: number | string;
}

interface ApiResponse {
  data: {
    success: boolean;
    message: string;
  };
}

interface DepartmentListProps {
  refresh: boolean;
  setRefresh: (value: boolean) => void;
}

const DepartmentList: React.FC<DepartmentListProps> = ({
  refresh,
  setRefresh,
}) => {
  const [filteredUrl] = useState<string>(
    "/api/department/ajax/department-list"
  );
  const navigate = useNavigate();


  const columns: TableColumn<ServiceRow>[] = [
    {
      name: "Sr. No.",
      selector: (row: ServiceRow) => row[0],
   
    },
    {
      name: "Department Name",
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
        response = await deactivateItem("tbl_department", id);
      } else {
        response = await activateItem("tbl_department", id);
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
    navigate("/department-master/" + id);
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
    
      const response: ApiResponse = await deleteItem("tbl_department", id);
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
          tableName="Service"
          url={filteredUrl}
          columns={columns}
          refresh={refresh}
 
         
        />
      </div>
    </>
  );
};

export default DepartmentList;
