import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AttendanceChart from './chart/AttendanceChart';
import DirectionChart from './chart/DirectionChart';
import RiskStudents from './chart/RiskStudents';
import AttendanceByGroupsChart from './chart/AttendanceByGroupsChart';
import AttendanceByWeekChart from './chart/WeeklyTrendChart';
import AttendanceByStudentChart from './chart/AttendanceByStudentChart';

const App: React.FC = () => {
  return (
    <div className="container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="dashboard-containers">
          <div className="container container-1">
            <AttendanceChart />
          </div>
          <div className="container container-2">
            <DirectionChart/>
          </div>
          <div className="container container-3">
            <RiskStudents/>
          </div>
          <div className="container container-4">
            <AttendanceByGroupsChart/>
          </div>
          <div className="container container-5">
            <AttendanceByWeekChart/>
          </div>
          <div className="container container-6">
            <AttendanceByStudentChart/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

