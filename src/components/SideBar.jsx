import React, { useState } from 'react';
import { Link, useLocation, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import NU from '../assets/NU Logo.png';
import PCSMA from '../assets/PCSMA Logo.png';
import { API_BASE } from "../service/api";



const dashboardTabs = [
  // { name: "Enrollment Trends", path: "/trends" },
  { name: "Demographics Analysis", path: "/demographics" },
  { name: "Program Comparison", path: "/programs" },
  { name: "Data Explorer", path: "/explorer" },
  // { name: "Topic Explorer", path: "/topic-explorer" },
  { name: "Topic Insights", path: "/topic-insights" },
  // { name: "Enrollment Prediction", path: "/predict" },
  // { name: "Geographic Distribution", path: "/geo" },
];

const Sidebar = ({setPreviewData}) => {
  const location = useLocation();

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      setMessage('');
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API_BASE}/upload/`, formData);
      setMessage("✅ Upload successful!");
      setError('');

      if (res.data.preview) {
        setPreviewData(res.data.preview); // ✅ Send to Layout > Home
      }

    } catch (err) {
      setError("❌ Upload failed. Please try again.");
      setMessage('');
    }
  };

  return (
    <aside className="w-72 bg-white h-screen flex flex-col justify-between border-r px-5 py-6 overflow-y-auto text-sm">
      <h1 className="text-xl font-semibold text-blue-700 mb-6 tracking-tight">
        <Link to="/">Dashboard</Link>
      </h1>

      {/* Dashboards */}
      <div className="mb-6">
        <nav className="space-y-1">
          {dashboardTabs.map(tab => (
            <Link
              key={tab.path}
              to={tab.path}
              className={`block px-3 py-1.5 rounded-md ${
                location.pathname === tab.path
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {tab.name}
            </Link>
          ))}
        </nav>
      </div>

      <hr className="border-gray-200 mb-6" />

      {/* Data Input */}
      <div>
        <p className="text-xs text-gray-500 font-semibold uppercase mb-2 tracking-wide">Data Input</p>

        {/* Upload Box */}
        <div className="bg-gray-50 border rounded-md p-4 mb-4 shadow-sm">
          <p className="text-xs font-medium text-gray-700 mb-1">
            Upload enrollment data <span className="text-gray-400">(CSV or Excel)</span>
          </p>

          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={(e) => setFile(e.target.files[0])}
            className="mt-2 mb-3 text-xs"
          />

          <button
            onClick={handleUpload}
            className="w-full text-xs bg-blue-600 text-white rounded-md py-1.5 hover:bg-blue-700"
          >
            Upload
          </button>

          {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
          {message && <p className="text-xs text-green-600 mt-2">{message}</p>}
        </div>

        {/* Expected Format */}
        <div className="text-xs text-gray-700 space-y-1">
          <p className="font-semibold mb-1">Expected Data Format</p>
          <ul className="list-disc ml-4 space-y-1">
            <li><strong>Enrollment Date:</strong> When students enrolled</li>
            <li><strong>Program/Course:</strong> What program students enrolled in</li>
            <li><strong>Demographics:</strong> Age, gender, region</li>
            <li><strong>Enrollment Status:</strong> Full-time, part-time</li>
          </ul>
        </div>
      </div>
      {/* Bottom: Logos */}
      <div className="p-4 flex justify-center items-center gap-3">
        <img src={NU} alt="NU Logo" className="h-20 object-contain" />
        <img src={PCSMA} alt="PCSMA Logo" className="h-25 object-contain" />
      </div>
    </aside>
  );
};

export default Sidebar;
