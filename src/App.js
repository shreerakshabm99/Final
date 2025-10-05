import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Recruiter from "./Recruiter";
import Seeker from "./Seeker";
import "./Recruiter.css";
import './Login.css'
import './Seeker.css'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/recruiter" element={<Recruiter />} />
        <Route path="/seeker" element={<Seeker />} />
      </Routes>
    </Router>
  );
}

export default App;
