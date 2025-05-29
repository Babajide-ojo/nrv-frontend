'use client';

import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import useDebounce from '@/lib/useDebounce';

export interface ColumnConfig {
  key: string;
  label: string;
  render?: (value: any, row: any) => any;
}

export interface FilterConfig {
  name: string;
  label: string;
  options: string[];
}

interface DataTableProps {
  endpoint: string;
  columns: ColumnConfig[];
  filters?: FilterConfig[];
  status?: string
  searchTerm?: boolean;
  rowActions?: (row: any) => JSX.Element;
}

export default function DataTable({
  endpoint,
  columns,
  filters = [],
  status,
  searchTerm = true,
  rowActions,
}: DataTableProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState<Record<string, string>>({});
  const debouncedSearch = useDebounce(search, 500);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    fetchData();
  }, [debouncedSearch, filterState, currentPage]);

  const fetchData = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedSearch) params.append('search', debouncedSearch);
    Object.entries(filterState).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    params.append('page', currentPage.toString());
    params.append('limit', pageSize.toString());

    const res = await fetch(`${endpoint}?${params.toString()}${status ? `&status=${status}` : ""}` );
    const json = await res.json();
    console.log({json});
    
    setData(json?.data || json?.data?.data || []);
    setTotalCount(json?.pagination?.total || json?.data?.pagination?.total || 0);
    setLoading(false);
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    if (currentPage <= half) {
      end = Math.min(totalPages, maxVisible);
    }

    if (currentPage + half > totalPages) {
      start = Math.max(1, totalPages - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md font-jakarta">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
  {searchTerm &&       <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/3"
        />}
        {filters.map((filter) => (
          <Select
            key={filter.name}
            onValueChange={(val) => {
              setFilterState((prev) => ({ ...prev, [filter.name]: val }));
              setCurrentPage(1);
            }}
            defaultValue=""
          >
            <option value="">{filter.label}</option>
            {filter.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </Select>
        ))}
      </div>

      <div className="overflow-auto rounded-lg">
        <table className="min-w-full text-left">
          <thead className="bg-[#F7F7F8] text-[#67667A] uppercase text-[13px] font-normal">
            <tr>
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3">{col.label}</td>
              ))}
              {rowActions && <th className="px-4 py-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td colSpan={columns.length + 1}>
                    <Skeleton className="h-10 my-2 w-full" />
                  </td>
                </tr>
              ))
            ) : data.length ? (
              data.map((row, i) => (
                <tr key={i} className="border-b border-b-gray-100 hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-[12px]">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {rowActions && (
                    <td className="px-4 py-3 text-[12px]">{rowActions(row._id)}</td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-4">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination with page numbers */}
      {!loading && totalPages > 0 && (
        <div className="flex justify-end items-center mt-4 gap-2 flex-wrap">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {currentPage > 3 && (
            <>
              <button
                onClick={() => setCurrentPage(1)}
                className="px-3 py-1 border rounded"
              >
                1
              </button>
              {currentPage > 4 && <span className="px-2">...</span>}
            </>
          )}

          {generatePageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border rounded ${
                currentPage === page ? 'bg-black text-white' : ''
              }`}
            >
              {page}
            </button>
          ))}

          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && <span className="px-2">...</span>}
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="px-3 py-1 border rounded"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
