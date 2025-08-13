import React from "react";
import { NavLink} from "react-router-dom";

const Sidebar: React.FC = () => {

  return (
    <div className="sidebar">
      <div className="sidebar-spacing" />
      <div className="sidebar-divider" />
      <NavLink
        to="/"
        className={({ isActive }) =>
          "sidebar-item" + (isActive ? " active" : "")
        }
         style={{ textDecoration: "none", color: "inherit" }}
      >
        Основное
      </NavLink>
      <NavLink
        to="/table"
        className={({ isActive }) =>
          "sidebar-item" + (isActive ? " active" : "")
        }
         style={{ textDecoration: "none", color: "inherit" }}
      >
        Таблица
      </NavLink>
    </div>
  );
};

export default Sidebar;

