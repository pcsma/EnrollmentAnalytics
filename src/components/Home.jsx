import React from "react";
import { useOutletContext } from "react-router-dom";

const Home = () => {
  const { previewData } = useOutletContext(); // ⬅️ Get data from Layout

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold text-gray-800">
        Welcome to the Enrollment Analytics Dashboard
      </h1>
      <p className="text-gray-600 mt-2">
        This interactive dashboard helps you visualize and analyze educational enrollment data.
      </p>
      <ul className="list-disc pl-6 mt-4 text-gray-700 space-y-1">
        <li>📈 Multi-view Analytics: Demographics, and Program Performance</li>
        <li>🔍 Interactive Filtering: Filter by programs, demographics</li>
        <li>📊 Rich Visualizations: Bar, line, pie charts</li>
        <li>📋 Data Explorer: Search raw data</li>
        {/* <li>💾 Export: Generate CSV or Excel reports</li> */}
      </ul>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-800">Getting Started:</h2>
        <ol className="list-decimal pl-6 mt-2 text-gray-700 space-y-1">
          <li>Go to <strong className="text-blue-600">Upload Data</strong> under <strong>Data Input</strong></li>
          <li>Navigate through analytics tabs on the left</li>
          <li>Apply filters to refine your view</li>
          <li>Export results as needed</li>
        </ol>
      </div>

      {previewData && previewData.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">📄 Preview of Uploaded Data</h2>
          <div className="overflow-auto border rounded-lg">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  {Object.keys(previewData[0]).map((col) => (
                    <th key={col} className="px-4 py-2 border-b">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="px-4 py-2 whitespace-nowrap">{val ?? '-'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
