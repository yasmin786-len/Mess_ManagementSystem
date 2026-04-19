
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import StaffDashboard from "./Pages/StaffDashboard";
import StaffMeals from "./Pages/StaffMeals";
import StaffWastage from "./Pages/StaffWastage";
import StaffComplaints from "./Pages/StaffComplaints";
import StudentLogin from "./Pages/StudentLogin";
import AdminLogin from "./Pages/AdminLogin";
import StaffLogin from "./Pages/StaffLogin";
import AdminSignup from "./Pages/AdminSignup";
import StudentSignup from "./Pages/StudentSignup";
import StaffSignup from "./Pages/StaffSignup";
import StudentDashboard from "./components/StudentDashboard";
import AdminDashboard from "./Pages/AdminDashboard";
import Billing from "./components/Billing";
import Complaints from "./components/Complaints";
import MealHistory from "./components/MealHistory";
import Settings from "./components/Settings";
import AdminAlerts from "./Pages/AdminAlerts";
import AdminBilling from "./Pages/AdminBilling";
import AdminComplaints from "./Pages/AdminComplaints";
import AdminAnalytics from "./Pages/AdminAnalytics";
import StudentLayout from "./components/StudentLayout";
import StaffMenu from "./Pages/StaffMenu";
import Notifications from "./Pages/Notifications";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/student-login" element={<StudentLogin />} />
                <Route path="/student-signup" element={<StudentSignup />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/meal-history" element={<MealHistory />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/notifications" element={<Notifications/>} />
        <Route path="/settings" element={<Settings />} />


        <Route path="/staff-login" element={<StaffLogin />} />
        <Route path="/staff-signup" element={<StaffSignup />} />

        <Route path="/staff-dashboard" element={<StaffDashboard />} />
        <Route path="/staff-meals" element={<StaffMeals />} />
        <Route path="/staff-menu" element={<StaffMenu />} />
        <Route path="/staff-wastage" element={<StaffWastage />} />
        <Route path="/staff-complaints" element={<StaffComplaints />} />
        
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-signup" element={<AdminSignup />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-alerts" element={<AdminAlerts />} />
        <Route path="/admin-billing" element={<AdminBilling />} />
        <Route path="/admin-complaints" element={<AdminComplaints />} />
        <Route path="/admin-analytics" element={<AdminAnalytics />} />
        
      </Routes>
    </BrowserRouter>
  );
}