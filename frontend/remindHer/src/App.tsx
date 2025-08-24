import React from "react";
import Dashboard from "./Components/main/dashboard";
import Welcome from "./Components/main/welcome";
import './index.css';

const App: React.FC = () => {
  return (
    <Dashboard>
      <Welcome />
    </Dashboard>
  );
}
export default App;