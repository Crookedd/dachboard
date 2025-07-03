import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  startOfWeek,
  endOfWeek,
  format,
  getISOWeek,
  subWeeks,
} from "date-fns";
import { ru } from "date-fns/locale";

interface WeekData {
  name: string;
  [key: string]: number | string;
}

const students = ["Смирнов В.В", "Иванова А.С", "Кузнецов Д.М"];
const subjects = ["Программирование", "Программная инженерия", "Веб-разработка"];
const lessonTypes = [ "Лекция", "Практика"];

const generateChartData = (student: string, _subject: string, _type: string): WeekData[] => {
  const result: WeekData[] = [];

  for (let i = 3; i >= 0; i--) {
    const baseDate = subWeeks(new Date(), i);
    const start = startOfWeek(baseDate, { weekStartsOn: 1 });
    const end = endOfWeek(baseDate, { weekStartsOn: 1 });
    const weekNum = getISOWeek(baseDate);
    const even = weekNum % 2 === 0;

    const formattedStart = format(start, "dd MMM", { locale: ru });
    const formattedEnd = format(end, "dd MMM", { locale: ru });

  

    result.push({
      name: `${even ? "Чет" : "Нечет"}\n${formattedStart} - ${formattedEnd}\n${weekNum} неделя ISO`,
      [student]: Math.floor(Math.random() * 50 + 40),
    });
  }

  return result;
};

const AttendanceByStudentChart = () => {
  const [student, setStudent] = useState<string>(students[0]);
  const [subject, setSubject] = useState<string>(subjects[0]);
  const [lessonType, setLessonType] = useState<string>(lessonTypes[0]);

  const chartData = generateChartData(student, subject, lessonType);

  return (
    <div className="weekly-trend-chart-container">
      <div className="header-weekly">
        <p>Посещаемость студента за 4 недели</p>
        <div className="filters">
          <select value={student} onChange={(e) => setStudent(e.target.value)}>
            {students.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            {subjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select value={lessonType} onChange={(e) => setLessonType(e.target.value)}>
            {lessonTypes.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={270}>
        <LineChart
          data={chartData}
        >
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
          <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: 25 }} />

          <Line
            type="monotone"
            dataKey={student}
            stroke="#8e44ad"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceByStudentChart;
