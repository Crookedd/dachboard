import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface WeekEntry {
  week: string;
  isoWeek: string;
  even: boolean;
  data: Array<{
    direction: string;
    group: string;
    value: number;
  }>;
}

interface Filters {
  course: string;
  direction: string;
}

const directionFullToShort: Record<string, string> = {
  "Прикладная информатика": "ПИ",
  "Математическое обеспечение и администрирование": "МОА",
  "Фундаментальная информатика": "ФИТ",
};

const directionShortToFull: Record<string, string> = Object.fromEntries(
  Object.entries(directionFullToShort).map(([full, short]) => [short, full])
);

const AttendanceByWeekChart = () => {
  const [filters, setFilters] = useState<Filters>({ course: "", direction: "" });
  const [data, setData] = useState<WeekEntry[]>([]);

  const directions = Object.values(directionFullToShort);
  const courses = ["1", "2", "3", "4"];

  const fetchData = async () => {

    try {
      const query = new URLSearchParams();
      if (filters.direction) {
        const fullDirection = directionShortToFull[filters.direction];
        if (fullDirection) query.append("direction", fullDirection);
      }
      if (filters.course) query.append("course", filters.course);

      const response = await fetch(`${import.meta.env.VITE_API}/weekly?${query.toString()}`);
      const json = await response.json();
      console.log("Полученные данные:", json);
      setData(json);
    } catch (err) {
      console.error("Ошибка при загрузке данных посещаемости:", err);
    } finally {
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const filteredGroups = Array.from(
    new Set(data.flatMap((week) => week.data.map((item) => item.group)))
  );

  const chartData = data.map((week) => {
  const entry: Record<string, any> = {
    name: `${week.even ? "Чет" : "Нечет"}\n${week.week.split("/")[1].trim()}\n${week.isoWeek}`,
  };

  filteredGroups.forEach((group) => {
    const found = week.data.find((item) => item.group === group);
    entry[group] = found ? found.value : 0;
  });

  return entry;
});

  const getColor = (group: string): string => {
    if (group.startsWith("ПИ")) return "#9b59b6";
    if (group.startsWith("МОА")) return "#3498db";
    if (group.startsWith("ФИТ")) return "#1abc9c";
    return "#888";
  };

  return (
    <div className="weekly-trend-chart-container" style={{ padding: "1rem" }}>
      <div className="header-weekly" style={{ marginBottom: "1rem" }}>
        <p>
          Посещаемость за последние 4 недели
        </p>
        <div className="filters" style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
          <select
            onChange={(e) => handleFilterChange("course", e.target.value)}
            value={filters.course}
          >
            <option value="">Курс...</option>
            {courses.map((c) => (
              <option key={c} value={c}>{c} курс</option>
            ))}
          </select>
          <select
            onChange={(e) => handleFilterChange("direction", e.target.value)}
            value={filters.direction}
          >
            <option value="">Направление...</option>
            {directions.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

        <ResponsiveContainer width="100%" height={290}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={({ x, y, payload }) => {
                const lines = payload.value.split("\n");
                return (
                  <g transform={`translate(${x},${y + 10})`}>
                    {lines.map((line: string, index: number) => (
                      <text
                        key={index}
                        x={0}
                        y={index * 14}
                        textAnchor="middle"
                        fontSize="12"
                        fill="#555"
                      >
                        {line}
                      </text>
                    ))}
                  </g>
                );
              }}
            />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: 32 }} />
            {filteredGroups.map((group) => (
              <Line
                key={group}
                type="monotone"
                dataKey={group}
                stroke={getColor(group)}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )
    </div>
  );
};

export default AttendanceByWeekChart;

