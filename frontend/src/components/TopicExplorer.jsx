import React, { useState } from 'react';
import axios from 'axios';

const TopicExplorer = () => {
  const [text, setText] = useState('');
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTopics([]);

    try {
      const res = await axios.post('http://localhost:8000/predict/topic', { text });
      setTopics(res.data.top_topics);
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Topic Modeling Explorer</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-sm font-medium mb-1">Enter any text (e.g., intent, profile)</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={4}
            className="w-full border px-3 py-2 rounded resize-none"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Predicting...' : 'Predict Topics'}
        </button>
      </form>

      {error && <div className="mt-4 text-red-600">{error}</div>}

      {topics.length > 0 && (
        <div className="mt-6 bg-gray-50 p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Top Predicted Topics</h2>
          <ul className="space-y-1 text-sm">
            {topics.map((topic, i) => (
              <li key={i} className="flex justify-between">
                <span>{topic.topic}</span>
                <span className="font-mono text-gray-700">{topic.score}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TopicExplorer;
