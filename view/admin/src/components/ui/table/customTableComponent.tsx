import React, { useState, useEffect, useCallback } from "react";
import DataTable, { TableColumn, SortOrder } from "react-data-table-component";
import instance from "../../../utils/axiosInstance";
// import Alert from "components/Alert";

// Type definitions
interface SearchValue {
  value: string;
}

interface OrderItem {
  column: number;
  dir: string;
}

interface RequestData {
  draw: number;
  start: number;
  length: number;
  search: SearchValue;
  order: OrderItem[];
}

interface ResponseData {
  data: any[];
  recordsFiltered: number;
}

interface CustomDataTableProps {
  tableName?: string;
  url: string;
  columns: TableColumn<any>[];
  refresh?: boolean | number;
  message?: string;
 search?: boolean;
  // filterdata?: any[];
}

// interface SortColumn {
//   name: string;
// }

const CustomDataTable: React.FC<CustomDataTableProps> = ({
  url,
  columns,
  refresh,
  search = true,
  // filterdata,
}) => {
  const [items, setItems] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [searchText, setSearchText] = useState<string>("");
  const [orderDirection, setOrderDirection] = useState<string>("DESC");
  const [orderColumn, setOrderColumn] = useState<number>(0);

  const fetchItems = useCallback(
    async (
      page: number,
      perPage: number = 10,
      search: string = ""
    ): Promise<void> => {
      setLoading(true);
      const draw = page;
      const start = (page - 1) * perPage;
      const length = perPage;

      const jsonData: RequestData = {
        draw,
        start,
        length,
        search: { value: search },
        order: [
          {
            column: orderColumn,
            dir: orderDirection,
          },
        ],
      };

      try {
        const response = await instance.post<ResponseData>(url, jsonData);
        const json = response.data;
        setItems(json.data);
        setTotalRows(json.recordsFiltered);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    },
    [url, orderColumn, orderDirection, refresh]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchItems(page, perPage, searchText);
    }, 500);
    return () => clearTimeout(timeout);
  }, [
    searchText,
    page,
    perPage,
    fetchItems,
    refresh,
    orderColumn,
    orderDirection,
  ]);

  const handlePageChange = (page: number): void => setPage(page);

  const handlePerRowsChange = async (
    newPerPage: number,
    page: number
  ): Promise<void> => {
    setPerPage(newPerPage);
    setPage(page);
  };

  const handleSort = (
    selectedColumn: TableColumn<any>,
    sortDirection: SortOrder
  ): void => {
    const index = columns.findIndex((col) => col.name === selectedColumn.name);
    setOrderColumn(index);
    setOrderDirection(sortDirection);
    setOrderDirection("DESC");
  };

  // const tableData = (filterdata ?? []).length > 0 ? filterdata! : items;
  return (
    <div className="page_sec">
      {search && (
        <div className="flex justify-end items-center">
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchText(e.target.value)
            }
            className="h-11 w-[300px] rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-1 "
          />
        </div>
      )}
      <div className="data-table-wrapper mt-3">
        <DataTable
          columns={columns}
          data={items}
          progressPending={loading}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          sortServer
          onSort={handleSort}
        />
      </div>
    </div>
  );
};

export default CustomDataTable;
