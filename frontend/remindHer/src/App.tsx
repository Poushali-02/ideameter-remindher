import React from "react";
import Dashboard from "./Components/main/dashboard";
import Welcome from "./Components/main/welcome";
import PcodForm from "./Components/pcod/pcod";
import MenstrualCycleDetector from "./Components/menstrual_cycle/menstrual";
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
        <Route path="menstrual_irregularity" element={
          <Dashboard>
            <MenstrualCycleDetector />
          </Dashboard>
        }/>
      </Routes>
    </Router>
  );
}
export default App;