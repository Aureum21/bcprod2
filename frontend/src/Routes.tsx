import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Choose from "./components/Choose";
import Signup from "./components/Sigup";
import AdminLayout from "./layouts/AdminLayout";
import AdminHome from "./pages/AdminPages/AdminHome";
import StudentLayout from "./layouts/StudentLayout";
import StudentHome from "./pages/StudentPages/StudentHome";
import RegisterToInst from "./pages/StudentPages/RegisterToInst";
import AddSkill from "./pages/StudentPages/AddSkill";
import AddCert from "./pages/StudentPages/AddCert";
import AddWorkExp from "./pages/StudentPages/AddWorkExp";
import TimeLineLayout from "./layouts/TimeLineLayout";
import WatitinForVerification from "./pages/WatitinForVerification";
import InstLayout from "./layouts/InstLayout";
import InstHome from "./pages/InstPages/InstHome";
import PendingStud from "./pages/InstPages/PendingStud";
import Transfer from "./pages/InstPages/Transfer";
import AddOfficialCert from "./pages/InstPages/AddOfficialCert";
import RecLayout from "./layouts/RecLayout";
import RecHome from "./pages/RecruiterPages/RecHome";
import Status from "./pages/InstPages/Status";
import Application from "./pages/StudentPages/Application";
import PendingEmp from "./pages/RecruiterPages/PendingEmp";
const routes = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout></AuthLayout>,
    children: [
      { index: true, element: <Choose /> },
      { path: "signup", element: <Signup /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout></AdminLayout>,
    children: [{ index: true, element: <AdminHome /> }],
  },
  {
    path: "/student",
    element: <StudentLayout></StudentLayout>,
    children: [
      { path: "home", element: <StudentHome /> },
      { path: "register-institution", element: <RegisterToInst /> },
      { path: "add-skill", element: <AddSkill /> },
      { path: "add-certificate", element: <AddCert /> },
      { path: "add-work-experience", element: <AddWorkExp /> },
      { path: "application", element: <Application /> },
    ],
  },
  {
    path: "/waiting-for-verification",
    element: <TimeLineLayout></TimeLineLayout>,
    children: [{ index: true, element: <WatitinForVerification /> }],
  },
  {
    path: "/institution",
    element: <InstLayout></InstLayout>,
    children: [
      { path: "home", element: <InstHome /> },
      { path: "pending-students", element: <PendingStud /> },
      { path: "transfer-students", element: <Transfer /> },
      { path: "add-certificate", element: <AddOfficialCert /> },
      { path: "status", element: <Status /> },
    ],
  },
  {
    path: "/employer",
    element: <RecLayout></RecLayout>,
    children: [
      { path: "home", element: <RecHome /> },
      { path: "pending-employees", element: <PendingEmp /> },
    ],
  },
]);
export default routes;
