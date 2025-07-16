import React, { useState, useEffect } from 'react';
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

const months = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

const predefinedPeriods = ['Прошлая неделя'];

const DirectionChart: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Прошлая неделя');
  const [data, setData] = useState<any[]>([]);

  const getBackendPeriod = (label: string): string => {
    if (label === 'Прошлая неделя') return 'last_week';
    if (label === 'Прошлый месяц') return 'last_month';

    const monthIndex = months.indexOf(label) + 1;
    return `month_${monthIndex}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const backendPeriod = getBackendPeriod(selectedPeriod);
        const response = await fetch(`${import.meta.env.VITE_API}/direction_summary?period=${backendPeriod}`);
        const result = await response.json();
        setData(result.data ?? result);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        setData([]);
      }
    };
    fetchData();
  }, [selectedPeriod]);

  return (
    <div className="direction-chart-container">
      <div className="direction-chart-header">
        <p>Посещаемость по направлению</p>
        <select
          className="direction-select"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          {predefinedPeriods.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
          <optgroup label="Месяцы">
            {months.map((month) => (
              <option key={month} value={month}>{`За ${month.toLowerCase()}`}</option>
            ))}
          </optgroup>
        </select>
      </div>
      <div className="direction-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={data} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
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
