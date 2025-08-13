import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import TablePage from "./pages/TablePage";

const App: React.FC = () => {
  return (
    <Router>
      <div className="container">
        <Sidebar />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/table" element={<TablePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
