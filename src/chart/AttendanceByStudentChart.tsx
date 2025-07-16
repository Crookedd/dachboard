import { useEffect, useState } from "react";
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
/*import {
  startOfWeek,
  endOfWeek,
  format,
 getISOWeek,
  subWeeks,
} from "date-fns";
import { ru } from "date-fns/locale";*/

interface WeekData {
  name: string;
  [key: string]: number | string;
}

interface Student {
  id: number;
  full_name: string;
}

interface Subject {
  id: number;
  name: string;
}

const lessonTypes = ["Лекция", "Практическое занятие"];

const AttendanceByStudentChart = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [lessonType, setLessonType] = useState<string>("Лекция");
  const [chartData, setChartData] = useState<WeekData[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/student_subject`)
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        if (data.length > 0) {
          setStudentId(data[0].id);
        }
      });
  }, []);

  useEffect(() => {
    if (studentId !== null) {
      fetch(`${import.meta.env.VITE_API}/student_subject/${studentId}/subject`)
        .then((res) => res.json())
        .then((data) => {
          setSubjects(data);
          if (data.length > 0) {
            setSubjectId(data[0].id);
          }
        });
    }
  }, [studentId]);

  useEffect(() => {
    if (studentId !== null && subjectId !== null && lessonType) {
      fetch(
        `${import.meta.env.VITE_API}/student_attendance?student_id=${studentId}&subject_id=${subjectId}&type_class=${lessonType}`
      )
        .then((res) => res.json())
        .then((data: number[]) => {
          const studentName =
            students.find((s) => s.id === studentId)?.full_name || "";

          /*const result: WeekData[] = [];
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
              [studentName]: data[i] || 0,
            });
          }*/
          //для наглядности использовать данные в феврале 6 неделя и в октябрь 2024 год(41,42,43,44)
                  const weeks = [
                    "07 окт - 13 окт\n41 неделя ISO",
                    "14 окт - 20 окт\n42 неделя ISO",
                    "21 окт - 27 окт\n43 неделя ISO",
                    "28 окт - 03 ноя\n44 неделя ISO",
                  ];

                  const result: WeekData[] = weeks.map((weekLabel, i) => ({
                    name: weekLabel,
                    [studentName]: data[i] || 0,
                  }));

          setChartData(result);
        });
    }
  }, [studentId, subjectId, lessonType, students]);

  return (
    <div className="weekly-trend-chart-container">
      <div className="header-weekly">
        <p>Посещаемость студента за 4 недели</p>
        <div className="filters">
          <select
            value={studentId ?? ""}
            onChange={(e) => setStudentId(Number(e.target.value))}
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.full_name}
              </option>
            ))}
          </select>

          <select
            value={subjectId ?? ""}
            onChange={(e) => setSubjectId(Number(e.target.value))}
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={lessonType}
            onChange={(e) => setLessonType(e.target.value)}
          >
            {lessonTypes.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={270}>
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
          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: 25 }}
          />
          <Line
            type="monotone"
            dataKey={
              students.find((s) => s.id === studentId)?.full_name || ""
            }
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

