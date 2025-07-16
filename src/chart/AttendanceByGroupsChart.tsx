import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import {
  addDays,
  format,
  startOfWeek,
  eachDayOfInterval,
} from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
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

interface AttendanceData {
  date: string;
  [group: string]: string | number;
}

const AttendanceByGroupsChart = () => {
  const [startDate, setStartDate] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [data, setData] = useState<AttendanceData[]>([]);
  const [prevData, setPrevData] = useState<AttendanceData[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("1");
  const [selectedDirection, setSelectedDirection] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const fetchAttendance = async () => {
    const formattedStart = format(startDate, "yyyy-MM-dd");
    const formattedEnd = format(addDays(startDate, 6), "yyyy-MM-dd");

    const params = new URLSearchParams({
      start_date: formattedStart,
      end_date: formattedEnd,
      course: selectedCourse,
    });
    if (selectedDirection) params.append("direction", selectedDirection);

    const res = await fetch(`${import.meta.env.VITE_API}/attendance_group/by-groups?${params}`);
    const result = await res.json();
    setData(fillMissingDates(result));
  };

  const fetchPrevWeek = async () => {
    const prevStart = addDays(startDate, -7);
    const formattedStart = format(prevStart, "yyyy-MM-dd");
    const formattedEnd = format(addDays(prevStart, 6), "yyyy-MM-dd");

    const params = new URLSearchParams({
      start_date: formattedStart,
      end_date: formattedEnd,
      course: selectedCourse,
    });
    if (selectedDirection) params.append("direction", selectedDirection);

    const res = await fetch(`${import.meta.env.VITE_API}/attendance_group/by-groups?${params}`);
    const result = await res.json();
    setPrevData(fillMissingDates(result, prevStart));
  };

  useEffect(() => {
    fetchAttendance();
    fetchPrevWeek();
  }, [startDate, selectedCourse, selectedDirection]);

  const groupKeys =
    data.length > 0 ? Object.keys(data[0]).filter((k) => k !== "date") : [];

  const fillMissingDates = (rawData: AttendanceData[], baseDate = startDate): AttendanceData[] => {
    const allDates = eachDayOfInterval({
      start: baseDate,
      end: addDays(baseDate, 5),
    }).map((d) => format(d, "dd.MM"));

    const dataMap = new Map<string, AttendanceData>();
    rawData.forEach((entry) => dataMap.set(entry.date, entry));

    const allGroupKeys = rawData.reduce((acc, curr) => {
      Object.keys(curr).forEach((key) => {
        if (key !== "date") acc.add(key);
      });
      return acc;
    }, new Set<string>());

    return allDates.map((date) => {
      if (dataMap.has(date)) return dataMap.get(date)!;
      const empty: AttendanceData = { date };
      allGroupKeys.forEach((g) => (empty[g] = 0));
      return empty;
    });
  };

  const getLineColor = (group: string): string => {
    const avg = (arr: AttendanceData[]) =>
      arr.reduce((sum, row) => sum + Number(row[group] || 0), 0) / (arr.length || 1);

    const currentAvg = avg(data);
    const prevAvg = avg(prevData);

    if (currentAvg > prevAvg) return "green";
    if (currentAvg < prevAvg) return "red";
    return "#8884d8"; // neutral
  };

  return (
    <div className="attendance-groups-chart-container">
      <div className="header-group">
        <p>Посещаемость по группам</p>
        <div className="filters">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="1">1 Курс</option>
            <option value="2">2 Курс</option>
            <option value="3">3 Курс</option>
            <option value="4">4 Курс</option>
          </select>
          <select
            value={selectedDirection}
            onChange={(e) => setSelectedDirection(e.target.value)}
          >
            <option value="">Направление...</option>
            <option value="Прикладная информатика">ПИ</option>
            <option value="Математическое обеспечение и администрирование">МОА</option>
            <option value="Фундаментальная информатика">ФИТ</option>
          </select>
        </div>
      </div>

      <div className="navigation" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <button onClick={() => setStartDate((prev) => addDays(prev, -7))}>←</button>
        <span
          onClick={() => setIsCalendarOpen((prev) => !prev)}
          style={{ cursor: "pointer", textDecoration: "underline" }}
        >
          {format(startDate, "dd.MM.yyyy")} – {format(addDays(startDate, 6), "dd.MM.yyyy")}
        </span>
        <button onClick={() => setStartDate((prev) => addDays(prev, 7))}>→</button>
      </div>

      {isCalendarOpen && (
        <div style={{ marginTop: "8px" }}>
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              if (date) {
                setStartDate(startOfWeek(date, { weekStartsOn: 1 }));
                setIsCalendarOpen(false);
              }
            }}
            inline
            calendarStartDay={1}
          />
        </div>
      )}

      <div className="chart-wrapper" style={{ height: "400px", marginTop: "20px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" interval={0}/>
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            {groupKeys.map((group) => (
              <Line
                key={group}
                type="monotone"
                dataKey={group}
                stroke={getLineColor(group)}
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


