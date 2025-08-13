import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ResponsiveContainer } from "recharts";

type GroupKey = "ПИ-221" | "МО-221" | "ФИТ-221";
type WeekKey = "21.05 – 26.05" | "14.05 – 19.05";


interface WeekData {
  week: WeekKey;
  data: Array<{ date: string } & Record<GroupKey, number>>;
  trend: Record<GroupKey, "up" | "down">;
}


const weeks: WeekData[] = [
  {
    week: "21.05 – 26.05",
    data: [
      { date: "21.05", "ПИ-221": 27.11, "МО-221": 14.91, "ФИТ-221": 12 },
      { date: "22.05", "ПИ-221": 74.84, "МО-221": 93.39, "ФИТ-221": 71 },
      { date: "23.05", "ПИ-221": 66.79, "МО-221": 76.98, "ФИТ-221": 23.5 },
      { date: "24.05", "ПИ-221": 25.59, "МО-221": 96.72, "ФИТ-221": 64.85 },
      { date: "25.05", "ПИ-221": 98.41, "МО-221": 89.49, "ФИТ-221": 69.99 },
      { date: "26.05", "ПИ-221": 76.26, "МО-221": 42.04, "ФИТ-221": 21.42 },
    ],
    trend: { "ПИ-221": "up", "МО-221": "down", "ФИТ-221": "down" }
  },
  {
    week: "14.05 – 19.05",
    data: [
      { date: "14.05", "ПИ-221": 18.3, "МО-221": 27.91, "ФИТ-221": 40 },
      { date: "15.05", "ПИ-221": 61.1, "МО-221": 85.3, "ФИТ-221": 45 },
      { date: "16.05", "ПИ-221": 54.8, "МО-221": 70.4, "ФИТ-221": 70 },
      { date: "17.05", "ПИ-221": 45.2, "МО-221": 75.3, "ФИТ-221": 71.2 },
      { date: "18.05", "ПИ-221": 72.9, "МО-221": 91.0, "ФИТ-221": 62.1 },
      { date: "19.05", "ПИ-221": 58.2, "МО-221": 50.3, "ФИТ-221": 52.3 },
    ],
    trend: { "ПИ-221": "down", "МО-221": "up", "ФИТ-221": "up" }
  }
];

const extractMeta = (groupName: string) => {
  const [direction, code] = groupName.split("-");
  const year = parseInt(code?.slice(0, 1) || "0"); 
  const groupYear = 2020 + year; 
  const currentYear = new Date().getFullYear();
  const course = Math.min(currentYear - groupYear + 1, 4).toString();

  return { direction, course };
};

const AttendanceByGroupsChart = () => {
  const [weekIndex, setWeekIndex] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState<string>("1");
  const [selectedDirection, setSelectedDirection] = useState<string>("");

  const current = weeks[weekIndex];
  const previous = weeks[weekIndex + 1];

  const allGroups = Object.keys(current.data[0]).filter((key) => key !== "date");

  const filteredGroups = allGroups.filter((group) => {
    const { direction, course } = extractMeta(group);
    const matchesCourse = course === selectedCourse;
    const matchesDirection = selectedDirection ? direction === selectedDirection : true;
    return matchesCourse && matchesDirection;
  });
  const getColor = (group: GroupKey): string => {
  if (!previous) return "#8884d8";
  return current.trend[group] === "up" ? "#34a853" : "#ea4335";
  };

  return (
    <div className="attendance-groups-chart-container">
      <div className="header-group">
        <p>Посещаемость по группам</p>
        <div className="filters">
          <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
            <option value="1">1 Курс</option>
            <option value="2">2 Курс</option>
            <option value="3">3 Курс</option>
            <option value="4">4 Курс</option>
          </select>
          <select value={selectedDirection} onChange={(e) => setSelectedDirection(e.target.value)}>
            <option value="">Направление...</option>
            <option value="ПИ">ПИ</option>
            <option value="МО">МО</option>
            <option value="ФИТ">ФИТ</option>
          </select>
        </div>
      </div>

      <div className="navigation">
        <button
          onClick={() => setWeekIndex((i) => Math.min(i + 1, weeks.length - 1))}
          disabled={weekIndex === weeks.length - 1}
        >
          ←
        </button>
        <span>{current.week}</span>
        <button
          onClick={() => setWeekIndex((i) => Math.max(i - 1, 0))}
          disabled={weekIndex === 0}
        >
          →
        </button>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={190}>
        <LineChart data={current.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            {filteredGroups.map((group) => (
            <Line
                key={group}
                type="monotone"
                dataKey={group}
                stroke={getColor(group as GroupKey)}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
            />
            ))}
        </LineChart>
        </ResponsiveContainer>
        </div>
    </div>
  );
};

export default AttendanceByGroupsChart;

