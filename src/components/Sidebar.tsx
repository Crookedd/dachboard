import React from 'react';

const Sidebar: React.FC = () => {
  return (
                <div className="sidebar">
                <div className="sidebar-item active">Основное</div>
                <div className="sidebar-item">Дисциплины</div>
                <div className="sidebar-item">Преподаватели</div>
                <div className="sidebar-item">Календарь</div>
            </div>

  );
};

export default Sidebar;

