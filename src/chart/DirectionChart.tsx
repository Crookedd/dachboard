import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

const dataMap: Record<string, any[]>  = {
  'Прошлая неделя': [
    { direction: 'ФИТ', attendance: 62.59 },
    { direction: 'ПИ', attendance: 37.28 },
    { direction: 'МОА', attendance: 14.72 },
  ],
  'Прошлый месяц': [
    { direction: 'ФИТ', attendance: 58.0 },
    { direction: 'ПИ', attendance: 41.3 },
    { direction: 'МОА', attendance: 23.5 },
  ],
  'Прошлый семестр': [
    { direction: 'ФИТ', attendance: 62.59 },
    { direction: 'ПИ', attendance: 37.28 },
    { direction: 'МОА', attendance: 14.72 },
  ],
};

const DirectionChart: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Прошлая неделя');
  const data = dataMap[selectedPeriod];

  return (
    <div className="direction-chart-container">
      <div className="direction-chart-header">
        <p>Посещаемость по направлению</p>
        <select
          className="direction-select"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          {Object.keys(dataMap).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>
      <div className="direction-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis type="category" dataKey="direction" />
            <Tooltip />
            <Bar dataKey="attendance" fill="#8979FF" radius={[0, 8, 8, 0]}>
              <LabelList dataKey="attendance" position="insideRight" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DirectionChart;
