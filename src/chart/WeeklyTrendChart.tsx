import { useState } from "react";
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
import {
  startOfWeek,
  endOfWeek,
  format,
  getISOWeek,
  subWeeks,
} from "date-fns";
import { ru } from "date-fns/locale";

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

const groupList = ["ПИ-221", "МО-221", "ФИТ-221"];

const extractMeta = (groupName: string) => {
  const [direction, code] = groupName.split("-");
  const year = parseInt(code?.slice(0, 1) || "0"); 
  const groupYear = 2020 + year; 
  const currentYear = new Date().getFullYear();
  const course = Math.min(currentYear - groupYear + 1, 4).toString();

  return { direction, course };
};

const generateLastNWeeks = (n: number): WeekEntry[] => {
  const result: WeekEntry[] = [];

  for (let i = n - 1; i >= 0; i--) {
    const baseDate = subWeeks(new Date(), i);
    const start = startOfWeek(baseDate, { weekStartsOn: 1 });
    const end = endOfWeek(baseDate, { weekStartsOn: 1 });
    const weekNum = getISOWeek(baseDate);
    const even = weekNum % 2 === 0;

    const formattedStart = format(start, "dd MMM", { locale: ru });
    const formattedEnd = format(end, "dd MMM", { locale: ru });

    const data = groupList.map((group) => ({
      group,
      direction: extractMeta(group).direction,
      value: Math.floor(Math.random() * 50 + 50),
    }));

    result.push({
      week: `${even ? "Чет" : "Нечет"} / ${formattedStart} – ${formattedEnd}`,
      isoWeek: `${weekNum} неделя ISO`,
      even,
      data,
    });
  }

  return result;
};

const allWeeks = generateLastNWeeks(4);

const AttendanceByWeekChart = () => {
  const [filters, setFilters] = useState<Filters>({ course: "", direction: "" });

  const directions = ["ПИ", "МО", "ФИТ"];
  const courses = ["1", "2", "3", "4"];

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const filteredGroups = groupList.filter((group) => {
    const meta = extractMeta(group);
    const matchDirection = filters.direction ? meta.direction === filters.direction : true;
    const matchCourse = filters.course ? meta.course === filters.course : true;
    return matchDirection && matchCourse;
  });

    const chartData = allWeeks.map((week) => {
    const entry: Record<string, any> = {
        name: `${week.even ? "Чет" : "Нечет"}\n${week.week.split("/")[1].trim()}\n${week.isoWeek}`,
    };
    week.data.forEach((item) => {
        if (filteredGroups.includes(item.group)) {
        entry[item.group] = item.value;
        }
    });
    return entry;
    });

  const getColor = (group: string): string => {
    if (group.startsWith("ПИ")) return "#9b59b6";
    if (group.startsWith("МО")) return "#3498db";
    if (group.startsWith("ФИТ")) return "#1abc9c";
    return "#888";
  };

  return (
    <div className="weekly-trend-chart-container">
      <div className="header-weekly">
        <p>Посещаемость за последние 4 недели</p>
        <div className="filters">
          <select onChange={(e) => handleFilterChange("course", e.target.value)}>
            <option value="">Курс...</option>
            {courses.map((c) => (
              <option key={c} value={c}>{c} курс</option>
            ))}
          </select>
          <select onChange={(e) => handleFilterChange("direction", e.target.value)}>
            <option value="">Направление...</option>
            {directions.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={290} >
        <LineChart data={chartData} >
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
              <Legend
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: 32 }}
                />

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
    </div>
  );
};

export default AttendanceByWeekChart;
