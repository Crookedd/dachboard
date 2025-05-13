import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  return (
    <div className="container">
      <Header />
      <Sidebar />
    </div>
  );
};

export default App;

