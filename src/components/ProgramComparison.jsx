import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { API_BASE } from "../service/api";

const ProgramComparison = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/analytics/programs/`)
      .then(res => setData(res.data))
      .catch(err => console.error("Failed to load program comparison data", err));
  }, []);

  return (
    <div className="px-6 md:pl-10 pt-6 space-y-10">
      <h1 className="text-3xl font-bold text-gray-800">Program Comparison</h1>

      {data.length > 0 && (
        <>
          {/* Table Section */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Enrollment by Program</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm border border-gray-300">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-2 border">Program</th>
                    <th className="p-2 border">Total</th>
                    <th className="p-2 border">Male</th>
                    <th className="p-2 border">Female</th>
                    <th className="p-2 border">Avg Age</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border p-2">{row.program}</td>
                      <td className="border p-2">{row.total}</td>
                      <td className="border p-2">{row.male}</td>
                      <td className="border p-2">{row.female}</td>
                      <td className="border p-2">{row.average_age?.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Chart Section */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Gender Distribution by Program</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 10, bottom: 100 }}
              >
                <XAxis
                  dataKey="program"
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  height={100}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(name) => name.length > 12 ? name.slice(0, 10) + "…" : name}
                />

                <YAxis />
                <Tooltip />
                <Legend verticalAlign="top" />
                <Bar dataKey="male" stackId="a" fill="#42a5f5" name="Male" />
                <Bar dataKey="female" stackId="a" fill="#ef5350" name="Female" />
              </BarChart>
            </ResponsiveContainer>
          </section>
        </>
      )}
    </div>
  );
};

export default ProgramComparison;
