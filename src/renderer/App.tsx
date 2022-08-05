import React, { FC } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Button } from 'antd';
import icon from '../../assets/icon.svg';
import './App.css';

const Hello: FC = () => {
  return <div>Hello</div>;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
