
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ImageUpload } from "./home.js";
import RecommendationPage from './RecommendationPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ImageUpload />} />
        <Route path="/recommendation" element={<RecommendationPage />} />
      </Routes>
    </Router>
  );
}

export default App;


