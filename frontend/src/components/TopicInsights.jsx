import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TopicInsights = () => {
  const [keywords, setKeywords] = useState([]);
  const [labels, setLabels] = useState([]);
  const [image, setImage] = useState(null);
  const [enrolledOnly, setEnrolledOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const insightsRes = await axios.get(`http://localhost:8000/analytics/topic-insights?enrolled_only=${enrolledOnly}`);
        const labelsRes = await axios.get('http://localhost:8000/analytics/topic-labels');

        setKeywords(insightsRes.data.keywords);
        setImage(`data:image/png;base64,${insightsRes.data.wordcloud}`);
        setLabels(labelsRes.data.topics);
      } catch (err) {
        setError('Failed to load topic insights');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [enrolledOnly]);

  return (
    <div className="px-6 md:pl-10 pt-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Topic Insights Dashboard</h1>

      {/* Toggle */}
      {/* <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Enrolled Only:</label>
        <input
          type="checkbox"
          checked={enrolledOnly}
          onChange={() => setEnrolledOnly(prev => !prev)}
          className="w-4 h-4"
        />
      </div> */}

      {loading && <p className="text-sm text-gray-500">Loading insights...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && (
        <>
          {/* Word Cloud */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Word Cloud</h2>
            {image && (
              <div className="w-full overflow-auto">
                <img
                  src={image}
                  alt="Word Cloud"
                  className="rounded shadow border border-gray-200 mx-auto"
                />
              </div>
            )}
          </section>

          {/* Top Keywords */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Top Keywords per Topic</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {keywords.map((topic, i) => (
                <div key={i} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                  <h3 className="font-semibold text-blue-600 mb-2 text-sm">
                    {labels[i]?.label
                      ? `Topic ${i + 1}: ${labels[i].label}`
                      : `Topic ${i + 1}`}
                  </h3>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {topic.keywords.map(([word, score], j) => (
                      <li key={j}>
                        {word} <span className="text-gray-500">({score})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default TopicInsights;
