import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const AttendanceChart: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Прошлая неделя');
  const [data, setData] = useState([]);

  const fetchData = async (period: string) => {
    const response = await fetch(`${import.meta.env.VITE_API}/attend/summary?period=${encodeURIComponent(period)}`);
    const result = await response.json();
    setData(result);
  };

  useEffect(() => {
    fetchData(selectedPeriod);
  }, [selectedPeriod]);

  return (
    <div className="attendance-chart-container">
      <div className="attendance-chart-header">
        <p>Посещаемость по курсам</p>
        <select
          className="attendance-select"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          {['Прошлая неделя', 'Прошлый месяц', 'Прошлый семестр'].map((period) => (
            <option key={period} value={period}>{period}</option>
          ))}
        </select>
      </div>
      <div className="attendance-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="course" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="attendance" fill="#8979FF" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttendanceChart;
