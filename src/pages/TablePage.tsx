import React, { useState, useRef, useEffect } from "react";
import HeaderTable from "../components/HeaderTable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaCalendarAlt } from "react-icons/fa";

interface Record {
  fullName: string;
  group: string;
  course: number;
  subject: string;
  teacher: string;
  date: Date;
  status: 0 | 1;
  comment: string;
}

const allData: Record[] = [
  {
    fullName: "Иванов В.В",
    group: "ПИ-221",
    course: 3,
    subject: "Программирование",
    teacher: "Бурмин Л.Н.",
    date: new Date("2024-10-03"),
    status: 1,
    comment: "—",
  },
  {
    fullName: "Петров П.П",
    group: "ФИТ-231",
    course: 1,
    subject: "Информатика",
    teacher: "Иванов А.А.",
    date: new Date("2024-10-02"),
    status: 0,
    comment: "Опоздал",
  },
    {
    fullName: "Митрофанов П.П",
    group: "ФИТ-231",
    course: 1,
    subject: "Информатика",
    teacher: "Иванов А.А.",
    date: new Date("2024-10-02"),
    status: 0,
    comment: "Опоздал",
  },
    {
    fullName: "Игнатьева В.В",
    group: "ПИ-221",
    course: 3,
    subject: "Программирование",
    teacher: "Бурмин Л.Н.",
    date: new Date("2024-10-03"),
    status: 0,
    comment: "Опоздал",
  },
    {
    fullName: "Петров П.П",
    group: "МОА-231",
    course: 1,
    subject: "Информатика",
    teacher: "Иванов А.А.",
    date: new Date("2024-11-02"),
    status: 0,
    comment: "Болеет",
  },
    {
    fullName: "Петров П.П",
    group: "ФИТ-231",
    course: 1,
    subject: "Информатика",
    teacher: "Иванов А.А.",
    date: new Date("2024-11-02"),
    status: 1,
    comment: "",
  },
];

const TablePage: React.FC = () => {
  const [groupFilter, setGroupFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState<number | "">("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [startDate, endDate] = dateRange;

  const handleClickOutside = (e: MouseEvent) => {
    if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
      setShowCalendar(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredData = allData.filter((record) => {
    const matchGroup = groupFilter ? record.group === groupFilter : true;
    const matchCourse = courseFilter ? record.course === courseFilter : true;
    const matchDate = (() => {
      if (!startDate && !endDate) return true;

      const recordTime = record.date.getTime();

      const start = startDate ? new Date(startDate.setHours(0, 0, 0, 0)).getTime() : null;
      const end = endDate ? new Date(endDate.setHours(23, 59, 59, 999)).getTime() : null;

      return (!start || recordTime >= start) && (!end || recordTime <= end);
    })();
    return matchGroup && matchCourse && matchDate;
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((r) => ({
        ФИО: r.fullName,
        Группа: r.group,
        Курс: r.course,
        Дисциплина: r.subject,
        Преподаватель: r.teacher,
        Дата: r.date.toLocaleDateString(),
        Статус: r.status ? "Был" : "Не был",
        Комментарий: r.comment,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Посещаемость");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "attendance.xlsx");
  };

  const uniqueGroups = [...new Set(allData.map((r) => r.group))];
  const uniqueCourses = [...new Set(allData.map((r) => r.course))];

  return (
    <div className="main-content">
      <HeaderTable />
      <div className="at-risk-container">
        <div className="filters" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <select value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)}>
            <option value="">Группа</option>
            {uniqueGroups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <select
            value={courseFilter}
            onChange={(e) =>
              setCourseFilter(e.target.value ? Number(e.target.value) : "")
            }
          >
            <option value="">Курс</option>
            {uniqueCourses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Кнопка Период */}
          <div style={{ position: "relative" }} ref={calendarRef}>
            <button
              onClick={() => setShowCalendar((prev) => !prev)}
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <FaCalendarAlt />
              Период
            </button>
            {showCalendar && (
              <div style={{ position: "absolute", zIndex: 10 }}>
                <DatePicker
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => setDateRange(update)}
                  isClearable
                  inline
                />
              </div>
            )}
          </div>

          <button onClick={exportToExcel}>Скачать</button>

            {/* Отображение выбранного периода */}
            {(startDate || endDate) && (
              <div style={{ marginTop: "5px", display: "flex", gap: "10px", alignItems: "center" }}>
                <span>
                  Период:{" "}
                  {startDate?.toLocaleDateString()}{" "}
                  {endDate && startDate?.toLocaleDateString() !== endDate?.toLocaleDateString()
                    ? `– ${endDate.toLocaleDateString()}`
                    : ""}
                </span>
                <button onClick={() => setDateRange([null, null])}>Сбросить</button>
              </div>
            )}
        </div>

        <div className="big-container">

        <p>Общая посещаемость студентов</p>

        <div className="table-wrapper">
          <table className="risk-table">
            <thead>
              <tr>
                <th>ФИО</th>
                <th>Группа</th>
                <th>Курс</th>
                <th>Дисциплина</th>
                <th>Преподаватель</th>
                <th>Дата</th>
                <th>Статус</th>
                <th>Комментарий</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, i) => (
                <tr key={i}>
                  <td>{row.fullName}</td>
                  <td>{row.group}</td>
                  <td>{row.course}</td>
                  <td>{row.subject}</td>
                  <td>{row.teacher}</td>
                  <td>{row.date.toLocaleDateString()}</td>
                  <td>{row.status ? "Был" : "Не был"}</td>
                  <td>{row.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  );
};

export default TablePage;

