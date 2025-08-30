import { useState } from "react";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useModal } from "../../hooks/useModal";

interface Enquiry {
  id: number;
  name: string;
  email: string;
  mobile: string;
  company: string;
  title: string;
  message: string;
}

// Sample Data
const enquiryData: Enquiry[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    mobile: "9876543210",
    company: "ABC Pvt Ltd",
    title: "Product Inquiry",
    message: `I am writing to enquire about the range of pesticides and fertilizers you offer for large-scale wheat and rice cultivation. We are planning for the upcoming sowing season and require products that are both effective and safe for long-term soil health.

Could you please send me detailed information on the following:

      Types of pesticides available(organic and chemical).

Recommended dosage per acre for wheat and rice.

Price list for bulk orders, including any seasonal discounts.

Safety guidelines for storage and application.

हमारी खेती लगभग 50 एकड़ में होती है और हम चाहते हैं कि उत्पाद मिट्टी की गुणवत्ता को खराब न करें और कीटों से पूरी तरह सुरक्षा दें। कृपया हमें यह भी बताएं कि क्या आपके पास सरकारी प्रमाणपत्र और गुणवत्ता जांच रिपोर्ट उपलब्ध है।

    Kindly reply at the earliest so that we can finalize our procurement plan..`
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    mobile: "9123456780",
    company: "XYZ Corp",
    title: "Pricing Request",
    message: "Can you share the latest price list for bulk orders?",
  },
];

export default function EnquiryTable() {
  const [filterText, setFilterText] = useState("");
  const [selectedItem, setSelectedItem] = useState<Enquiry | null>(null);

  const { isOpen: isMessageOpen, openModal: openMessageModal, closeModal: closeMessageModal } = useModal();

  const filteredData = enquiryData.filter(
    (item) =>
      item.name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.email.toLowerCase().includes(filterText.toLowerCase()) ||
      item.mobile.includes(filterText) ||
      item.company.toLowerCase().includes(filterText.toLowerCase()) ||
      item.title.toLowerCase().includes(filterText.toLowerCase())
  );

  const columns = [
    {
      name: "Sr. No.",
      cell: (_row: Enquiry, index: number) => index + 1,
   
      width: "80px",
    },
    {
      name: "Name",
      selector: (row: Enquiry) => row.name,
      sortable: true,
   
    },
    {
      name: "Email",
      selector: (row: Enquiry) => row.email,
      sortable: true,
    
    },
    {
      name: "Mobile No",
      selector: (row: Enquiry) => row.mobile,
      
    },
    {
      name: "Company Name",
      selector: (row: Enquiry) => row.company,
    
    },
    {
      name: "Title",
      selector: (row: Enquiry) => row.title,
    
    },
    {
      name: "Message",
      cell: (row: Enquiry) => (
        <button
          className="text-blue-600 underline"
          onClick={() => {
            setSelectedItem(row);
            openMessageModal();
          }}
        >
          View
        </button>
      ),
   
    },
    {
      name: "Action",
      cell: () => (
        <div className="flex justify-center gap-7 items-center w-full">
          <button title="Edit" className="text-green-600 hover:text-green-800">
            <FaEdit size={18} />
          </button>
          <button title="Delete" className="text-red-600 hover:text-red-800">
            <FaTrash size={18} />
          </button>
        </div>
      ),
     
    },
  ];

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      {/* Search bar */}
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          className="h-11 w-full md:w-1/3 ps-4 appearance-none rounded-lg border px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-1"
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

      {/* Message Modal */}
      {isMessageOpen && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Enquiry Message</h2>

            <div className="mb-4"><strong>Message:</strong> {selectedItem.message}</div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={closeMessageModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
