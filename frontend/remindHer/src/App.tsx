import React from "react";
import Dashboard from "./Components/main/dashboard";
import Welcome from "./Components/main/welcome";
import PcodForm from "./Components/pcod/pcod";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Dashboard>
            <Welcome />
          </Dashboard>} />

        <Route path="/pcod_tracker" element={
          <Dashboard>
            <PcodForm />
          </Dashboard>} />
      </Routes>
    </Router>
  );
}
export default App;