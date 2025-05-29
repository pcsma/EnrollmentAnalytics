import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { uploadCSV } from "../service/api";

const DataExplorer = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(20);

  // Step 1: Fetch entire dataset (no pagination from server)
  useEffect(() => {
    axios.get(`${uploadCSV}/analytics/explorer/all`)
      .then(res => {
        setAllData(res.data.records);
      })
      .catch(err => console.error('Failed to fetch data', err));
  }, []);

  // Step 2: Apply search + pagination logic
  useEffect(() => {
    const lower = search.toLowerCase();
    const regex = new RegExp(`\\b${lower}\\b`, 'i');

    const filtered = !search
      ? allData
      : allData.filter(row =>
          Object.values(row).some(val =>
            regex.test(String(val))
          )
        );

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);

    setFilteredData(paginated);
    setTotalPages(Math.ceil(filtered.length / limit));
  }, [search, allData, page, limit]);

  // Step 3: Reset page when user searches
  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div className="px-6 md:pl-10 pt-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Data Explorer</h1>

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 w-full shadow-sm"
      />

      <div className="bg-white rounded-lg shadow overflow-x-auto p-4">
        <table className="min-w-full text-sm border border-gray-200">
          <thead className="bg-gray-100 text-left">
            <tr>
              {filteredData[0] &&
                Object.keys(filteredData[0]).map((col, idx) => (
                  <th key={idx} className="border px-3 py-2 text-gray-700 font-medium">
                    {col}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {Object.values(row).map((val, j) => (
                  <td
                    key={j}
                    className="border px-3 py-2 whitespace-nowrap text-gray-800"
                  >
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 pt-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage(prev => Math.max(1, prev - 1))}
          className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm text-gray-700">Page {page} of {totalPages}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(prev => prev + 1)}
          className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataExplorer;
