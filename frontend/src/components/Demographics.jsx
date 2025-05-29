import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = ['#007bff', '#00bcd4', '#ffc107', '#ff6384', '#36a2eb', '#4caf50', '#795548', '#9c27b0'];

const Demographics = () => {
  const [gender, setGender] = useState(null);
  const [course, setCourse] = useState(null);
  const [age, setAge] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/analytics/demographics/gender').then(res => setGender(res.data));
    axios.get('http://localhost:8000/analytics/demographics/course').then(res => setCourse(res.data));
    axios.get('http://localhost:8000/analytics/demographics/age').then(res => setAge(res.data));
  }, []);

  return (
    <div className="px-6 md:pl-10 pt-6 space-y-10">
      <h1 className="text-3xl font-bold text-gray-800">Demographics Overview</h1>

      {/* GENDER */}
      {gender && (
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Enrollment by Gender</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <table className="text-sm border border-gray-300 w-full">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border">Gender</th>
                  <th className="p-2 border">Count</th>
                </tr>
              </thead>
              <tbody>
                {gender.labels.map((g, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border px-3 py-2">{g}</td>
                    <td className="border px-3 py-2">{gender.counts[i]}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={gender.labels.map((g, i) => ({ name: g, value: gender.counts[i] }))}
                  cx="50%" cy="50%" outerRadius={80} dataKey="value" label
                >
                  {gender.labels.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* COURSE */}
      {course && (
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Enrollment by Course</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <table className="text-sm border border-gray-300 w-full max-h-[300px] overflow-y-auto">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border">Course</th>
                  <th className="p-2 border">Count</th>
                </tr>
              </thead>
              <tbody>
                {course.labels.map((label, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border px-3 py-2">{label}</td>
                    <td className="border px-3 py-2">{course.counts[i]}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={course.labels.map((label, i) => ({ name: label, value: course.counts[i] }))}
                  dataKey="value"
                  outerRadius={100}
                  innerRadius={50}
                  label
                >
                  {course.labels.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* AGE */}
      {age && (
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Enrollment by Age Group</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={age.labels.map((label, i) => ({ label, value: age.counts[i] }))}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-gray-700 flex flex-wrap gap-4">
            <span><strong>Average:</strong> {age.average}</span>
            <span><strong>Median:</strong> {age.median}</span>
            <span><strong>Youngest:</strong> {age.youngest}</span>
            <span><strong>Oldest:</strong> {age.oldest}</span>
          </div>
        </section>
      )}
    </div>
  );
};

export default Demographics;
