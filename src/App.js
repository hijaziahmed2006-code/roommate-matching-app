import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        {/* Add more routes here */}
      </Routes>
    </Router>
  );
}

function Home() {
  return <h1>Home Page</h1>;
}

function Profile() {
  return <h1>Profile Page</h1>;
}

export default App;