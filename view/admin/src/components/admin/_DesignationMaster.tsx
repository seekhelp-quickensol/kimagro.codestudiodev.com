import { useState } from "react";
import ComponentCard from "./../common/ComponentCard";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Designation {
  id: number;
  name: string;
}

export default function DesignationMaster() {
  const [filterText, setFilterText] = useState("");
  const [tableData, setTableData] = useState<Designation[]>([
    { id: 1, name: "Field Officer" },
    { id: 2, name: "IT Support Engineer" },
    { id: 3, name: "Procurement Officer" },
  ]);

  const [designationName, setDesignationName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!designationName.trim()) return;

    const newEntry: Designation = {
      id: tableData.length + 1,
      name: designationName,
    };

    setTableData([...tableData, newEntry]);
    setDesignationName("");
  };

  const filteredData = tableData.filter((item) =>
    item.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const columns = [
    {
      name: "Sr. No.",
      cell: (_row: Designation, index: number) => index + 1,
      center: true,
    },
    {
      name: "Designation Name",
      selector: (row: Designation) => row.name,
      sortable: true,
      center: true,
    },
    {
      name: "Action",
      cell: () => (
        <div className="flex justify-center gap-7 items-center w-full">
          <button title="Edit" className="text-green-600 hover:text-green-800">
            <FaEdit size={15} />
          </button>
          <button title="Delete" className="text-red-600 hover:text-red-800">
            <FaTrash size={15} />
          </button>
        </div>
      ),
      center: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Form */}
      <ComponentCard title="Designation Master" desc="Add Designation">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-12 gap-6">
            {/* Designation Name */}
            <div className="col-span-12 md:col-span-6">
              <Label>
                Designation Name<span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                placeholder="Enter Designation Name"
                className="w-full"
                value={designationName}
                onChange={(e) => setDesignationName(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <div className="col-span-12">
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                Submit
              </button>
            </div>
          </div>
        </form>
      </ComponentCard>

      {/* Table */}
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
    </div>
  );
}
