import React, { useState } from 'react';

const UploadForm = ({ setPreviewData }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first.');
      setSuccess(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
const API_BASE = import.meta.env.VITE_API_BASE;

    try {
      const response = await fetch(`${API_BASE}/upload/`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setMessage("✅ Upload successful!");
        setSuccess(true);

        // ✅ Set local and global preview
        if (result.preview) {
          setPreviewData(result.preview);
          if (setPreviewData) setPreviewData(result.preview);
        }
      } else {
        const error = await response.json();
        setMessage(`❌ Upload failed: ${error.detail || response.status}`);
        setSuccess(false);
      }
    } catch (err) {
      setMessage("❌ Upload error: " + err.message);
      setSuccess(false);
    }
  };

  return (
    <div className="text-sm">
      <input
        type="file"
        accept=".csv,.xlsx"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-2"
      />
      <button
        onClick={handleUpload}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Upload
      </button>
      {message && (
        <p className={`mt-2 ${success ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}

      {previewData && previewData.length > 0 && (
        <div className="mt-4 bg-white shadow rounded p-3 overflow-x-auto">
          <h3 className="text-md font-semibold mb-2">📄 File Preview</h3>
          <table className="table-auto text-sm border w-full">
            <thead>
              <tr className="bg-gray-100 text-left">
                {Object.keys(previewData[0]).map((key) => (
                  <th key={key} className="border px-2 py-1">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {Object.values(row).map((val, i) => (
                    <td key={i} className="border px-2 py-1">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
