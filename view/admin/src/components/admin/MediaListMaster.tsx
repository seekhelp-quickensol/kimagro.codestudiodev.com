import { useState } from "react";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash } from "react-icons/fa";

// Media Category Data
interface MediaCategory {
  id: number;
  mediaCategory: string;
  nameEnglish: string;
  nameHindi: string;
}

const tableData: MediaCategory[] = [
  { id: 1, mediaCategory: "Photos", nameEnglish: "Agriculture", nameHindi: "कृषि" },
  { id: 2, mediaCategory: "Videos", nameEnglish: "Pesticides", nameHindi: "कीटनाशक" },
  { id: 3, mediaCategory: "News", nameEnglish: "Fertilizers", nameHindi: "उर्वरक" },
];

export default function MediaMasterCategoryList() {
  const [filterText, setFilterText] = useState("");

  const filteredData = tableData.filter(
    (item) =>
      item.mediaCategory.toLowerCase().includes(filterText.toLowerCase()) ||
      item.nameEnglish.toLowerCase().includes(filterText.toLowerCase()) ||
      item.nameHindi.toLowerCase().includes(filterText.toLowerCase())
  );

  const columns = [
    {
      name: "Sr. No.",
      cell: (_row: MediaCategory, index: number) => index + 1,
      width: "90px",

    },
    {
      name: "Media Category",
      selector: (row: MediaCategory) => row.mediaCategory,
      sortable: true,
   
    },
    {
      name: "Category Name (English)",
      selector: (row: MediaCategory) => row.nameEnglish,
      sortable: true,
 
    },
    {
      name: "Category Name (Hindi)",
      selector: (row: MediaCategory) => row.nameHindi,
      sortable: true,
     
    },
    {
      name: "Action",
      cell: () => (
        <div className="flex justify-center gap-7 items-center w-full pe-[30px]">
          <button title="Edit" className="text-green-600 hover:text-green-800">
            <FaEdit size={15} />
          </button>
          <button title="Delete" className="text-red-600 hover:text-red-800">
            <FaTrash size={15} />
          </button>
        </div>
      ),
     
    },
  ];

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      {/* Search bar */}
      <div className="mb-4 flex justify-between items-center ">
        <input
          type="text"
          placeholder="Search..."
          className="h-11 w-full md:w-1/3 ps-4 appearance-none rounded-lg border px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        persistTableHead
      />
    </div>
  );
}
