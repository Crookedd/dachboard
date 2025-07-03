import React from 'react';

const Header: React.FC = () => {
  return (
  <div className="header">
    <h1>Мониторинг посещаемости студентов</h1>
        <div className="auth-section">
        <img src="src\assets\icon\person_24dp_8979FF_FILL0_wght400_GRAD0_opsz24.svg" alt="Профиль" className="profile-icon" />
        <div className="enter-button">Войти</div>
      </div>
  </div>
  );
};

export default Header;

