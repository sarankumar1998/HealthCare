import "./App.css";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import DoctorLogin from "./components/DoctorsAuth/DoctorLogin/DoctorLogin";
import DoctorSignup from "./components/DoctorsAuth/DoctorSignup/DoctorSignup";
import Landing from "./components/Landing/Landing";
import Navbar from "./components/Navbar/Navbar";
import PatientSignup from "./components/PatientAuth/PatientSignup/PatientSignup";
import PatientLogin from "./components/PatientAuth/PatientLogin/PatientLogin";
import DoctorHome from "./components/DoctorContainers/DoctorHome";
import PatientsBooking from "./components/PatientContainers/PatientsBooking";
// import RouteAuth from "./components/RouteAuth/RouteAuth";
// import PatientSignup from "./components/PatientAuth/PatientSignup/PatientSignup";

function App() {

  return (
    <div className="App">
        
      <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/doctorLogin" element={<DoctorLogin />} />
          <Route path="/doctorSignup" element={<DoctorSignup />} />
          <Route path="/patientSignup" element={<PatientSignup />} />
          <Route path="/patientLogin" element={<PatientLogin />} />
          <Route path="/login" element={<DoctorLogin />} />
        <Route path="/doctorHome" element={<DoctorHome />} />
        <Route path="/patientsBooking" element={<PatientsBooking />} />


        </Routes>
      </Router>

    </div>
  );
}

export default App;