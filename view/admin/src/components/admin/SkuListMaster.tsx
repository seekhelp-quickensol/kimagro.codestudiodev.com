import { useState } from "react";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash } from "react-icons/fa";

// Sample SKU Data
interface SKU {
  id: number;
  quantity: number;
  unit: string;
}

const tableData: SKU[] = [
  { id: 1, quantity: 5, unit: "Kg" },
  { id: 2, quantity: 500, unit: "Gram" },
  { id: 3, quantity: 2, unit: "Liter" },
];

export default function SkuTable() {
  const [filterText, setFilterText] = useState("");

  const filteredData = tableData.filter(
    (item) =>
      item.quantity.toString().includes(filterText.toLowerCase()) ||
      item.unit.toLowerCase().includes(filterText.toLowerCase())
  );

  const columns = [
    {
      name: "Sr. No.",
      cell: (_row: SKU, index: number) => index + 1,

    },
    {
      name: "Quantity",
      selector: (row: SKU) => row.quantity,
      sortable: true,
      
    },
    {
      name: "Unit",
      selector: (row: SKU) => row.unit,
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
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          className="h-11 w-full md:w-1/3 ps-4 appearance-none rounded-lg border px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-1"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

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
