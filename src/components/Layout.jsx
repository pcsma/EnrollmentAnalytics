import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './SideBar';

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed z-30 inset-y-0 left-0 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:w-64 md:flex-shrink-0`}
      >
        {/* ❌ DO NOT use useOutletContext() in Sidebar – instead pass props directly */}
        <Sidebar setPreviewData={setPreviewData} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-0">
        <div className="md:hidden flex items-center justify-between p-4 bg-white shadow">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 text-2xl focus:outline-none"
          >
            ☰
          </button>
          <span className="ml-4 font-semibold text-lg text-gray-800">Enrollment Dashboard</span>
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* ✅ Provide context here to Home and other children */}
          <Outlet context={{ previewData, setPreviewData }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;
