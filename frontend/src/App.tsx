import { Route, Routes } from "react-router-dom";
import AdminHome from "./pages/AdminPages/AdminHome";
import StudentHome from "./pages/StudentPages/StudentHome";
import PendingStud from "./pages/InstPages/PendingStud";
import AddOfficialCert from "./pages/InstPages/AddOfficialCert";
import Transfer from "./pages/InstPages/Transfer";
import Connect from "./pages/Connect";
import RegisterToInst from "./pages/StudentPages/RegisterToInst";
import AddSkill from "./pages/StudentPages/AddSkill";
import AddCert from "./pages/StudentPages/AddCert";
import AddWorkExp from "./pages/StudentPages/AddWorkExp";
import InstHome from "./pages/InstPages/InstHome";
import RecHome from "./pages/RecruiterPages/RecHome";
import { Web3Provider } from "./Web3ContextProvider";
import Register from "./pages/Register";
import WatitinForVerification from "./pages/WatitinForVerification";

function App() {
  return (
    <Web3Provider>
      <Routes>
        {/* Connect Page */}
        <Route path="/" element={<Connect />} />

        {/* Admin Page */}
        <Route path="/admin-home" element={<AdminHome />} />

        {/* Student Page */}
        <Route path="/Student-home" element={<StudentHome />} />
        <Route
          path="/Student-register-institution"
          element={<RegisterToInst />}
        />
        <Route path="/student-add-skill" element={<AddSkill />} />
        <Route path="/student-add-certificate" element={<AddCert />} />
        <Route path="/student-add-work-experience" element={<AddWorkExp />} />

        {/* Institution Page */}
        <Route path="/institution-home" element={<InstHome />} />
        <Route path="/institution-pending-students" element={<PendingStud />} />
        <Route path="/institution-transfer-students" element={<Transfer />} />
        <Route
          path="/institution-add-certificate"
          element={<AddOfficialCert />}
        />
        {/* Recruiter Page */}
        <Route path="/rec-home" element={<RecHome />} />
        {/* Register page */}
        <Route path="/register" element={<Register />} />
        {/* Waiting for verification */}
        <Route
          path="/waiting-for-verification"
          element={<WatitinForVerification />}
        />
      </Routes>
    </Web3Provider>
  );
}

export default App;
