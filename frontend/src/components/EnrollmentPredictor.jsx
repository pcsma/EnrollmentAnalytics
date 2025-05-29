import React, { useState } from 'react';
import axios from 'axios';

const EnrollmentPredictor = () => {
  const [form, setForm] = useState({ age: '', gender: '', course: '' });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setPrediction(null);
    setError('');

    try {
      const res = await axios.post('http://localhost:8000/analytics/predict-enrollment', {
        age: parseInt(form.age),
        gender: form.gender,
        course: form.course
      });
      setPrediction(res.data.predicted_entry_level);
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed');
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Enrollment Predictor</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-sm font-medium mb-1">Age</label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select</option>
            <option value="FEMALE">FEMALE</option>
            <option value="MALE">MALE</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Course</label>
          <input
            type="text"
            name="course"
            value={form.course}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Predict
        </button>
      </form>

      {prediction && (
        <div className="mt-4 text-green-700 font-semibold">
          Predicted Entry Level: {prediction}
        </div>
      )}
      {error && (
        <div className="mt-4 text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default EnrollmentPredictor;
