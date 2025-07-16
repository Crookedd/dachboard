import React, { useEffect, useState } from 'react';

type Student = {
  full_name: string;
  group: string;
  missed: number;
};

  const RiskStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [sortAsc, setSortAsc] = useState(true);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API}/risk_students`);
      const data = await response.json();
      setStudents(data.data);
    } catch (err) {
      console.error("Ошибка загрузки:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSort = () => {
    const sorted = [...students].sort((a, b) =>
      sortAsc ? a.missed - b.missed : b.missed - a.missed
    );
    setStudents(sorted);
    setSortAsc(!sortAsc);
  };

  return (
    <div className="at-risk-container">
      <p>Студенты в зоне риска</p>
      <div className="table-wrapper">
        <table className="risk-table">
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Группа</th>
              <th className="clickable" onClick={handleSort}>
                Кол. Пропусков {sortAsc ? '▲' : '▼'}
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td>{student.full_name}</td>
                <td>{student.group}</td>
                <td>{student.missed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiskStudents;

