import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Select from './Select/Select';
import Plan from './Plan/Plan';
import Loading from './Loading/Loading'
import Recipe from './Recipe/Recipe'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes basename="/MealPlanner">
        <Route path="/" element={<Select />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/recipe" element={<Recipe />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
