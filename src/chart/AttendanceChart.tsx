import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const dataMap: Record<string, any[]> = {
  'Прошлая неделя': [
    { course: '1 курс', attendance: 70 },
    { course: '2 курс', attendance: 55 },
    { course: '3 курс', attendance: 45 },
    { course: '4 курс', attendance: 95 },
  ],
  'Прошлый месяц': [
    { course: '1 курс', attendance: 75 },
    { course: '2 курс', attendance: 60 },
    { course: '3 курс', attendance: 50 },
    { course: '4 курс', attendance: 90 },
  ],
  'Прошлый семестр': [
    { course: '1 курс', attendance: 80 },
    { course: '2 курс', attendance: 65 },
    { course: '3 курс', attendance: 55 },
    { course: '4 курс', attendance: 92 },
  ]
};

const AttendanceChart: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Прошлая неделя');
  const data = dataMap[selectedPeriod];

  return (
    <div className="attendance-chart-container">
      <div className="attendance-chart-header">
        <p>Посещаемость по курсам</p>
        <select
          className="attendance-select"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          {Object.keys(dataMap).map((period) => (
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