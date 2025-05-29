import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import EnrollmentTrends from './components/EnrollmentTrends';
import Demographics from './components/Demographics';
import ProgramComparison from './components/ProgramComparison';
import GeographicMap from './components/GeographicMap';
import EnrollmentPredictor from './components/EnrollmentPredictor';
import DataExplorer from './components/DataExplorer';
import Home from './components/Home';
import TopicExplorer from './components/TopicExplorer';
import TopicInsights from './components/TopicInsights';

const App = () => {
  const [previewData, setPreviewData] = useState(null);

  return (
    <Routes>
      {/* Shared Layout */}
      <Route
        path="/"
        element={<Layout previewData={previewData} setPreviewData={setPreviewData} />}
      >
        <Route index element={<Home preview={previewData} />} />
        {/* <Route path="trends" element={<EnrollmentTrends />} /> */}
        <Route path="demographics" element={<Demographics />} />
        <Route path="programs" element={<ProgramComparison />} />
        {/* <Route path="geo" element={<GeographicMap />} /> */}
        {/* <Route path="predict" element={<EnrollmentPredictor />} /> */}
        <Route path="explorer" element={<DataExplorer />} />
        {/* <Route path="/topic-explorer" element={<TopicExplorer />} /> */}
        <Route path="/topic-insights" element={<TopicInsights />} />
      </Route>
    </Routes>
  );
};

export default App;
