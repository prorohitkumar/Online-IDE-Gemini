import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Choice from './components/Choice';
import ReviewCode from './components/ReviewCode';
import ReviewProject from './components/ReviewProject';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Choice />} />
        <Route path="/review-code" element={<ReviewCode />} />
        <Route path="/review-project" element={<ReviewProject />} />
      </Routes>
    </Router>
  );
};

export default App;
