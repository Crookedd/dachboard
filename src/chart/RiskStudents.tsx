import React, { useState } from 'react';

type Student = {
  name: string;
  group: string;
  missed: number;
};

const initialStudents: Student[] = [
  { name: 'Иванов Иван', group: 'ПИ-201', missed: 12 },
  { name: 'Петров Петр', group: 'ФИТ-301', missed: 15 },
  { name: 'Сидоров Сидор', group: 'МО-101', missed: 11 },
  { name: 'Алексеева Мария', group: 'ПИ-202', missed: 18 },
  { name: 'Кузнецов Алексей', group: 'ФИТ-302', missed: 20 },
  { name: 'Васильева Анна', group: 'МО-102', missed: 13 },
  { name: 'Смирнов Андрей', group: 'ПИ-203', missed: 14 },
  { name: 'Николаева Ирина', group: 'ФИТ-303', missed: 17 },
  { name: 'Орлов Дмитрий', group: 'МО-103', missed: 16 },
  { name: 'Григорьев Артем', group: 'ПИ-204', missed: 19 },
];

const RiskStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [sortAsc, setSortAsc] = useState(true);

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
                <td>{student.name}</td>
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

