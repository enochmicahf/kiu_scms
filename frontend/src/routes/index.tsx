import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from '../components/layout/ProtectedRoute';

// Foundational SCMS Pages
import StudentDashboard from '../pages/dashboard/StudentDashboard';
import ComplaintsList from '../pages/dashboard/ComplaintsList';
import NewComplaint from '../pages/dashboard/NewComplaint';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import AdminReports from '../pages/dashboard/AdminReports';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Dashboard Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="student" replace />} />
        <Route path="student" element={<StudentDashboard />} />
        <Route path="student/complaints" element={<ComplaintsList />} />
        <Route path="student/complaints/new" element={<NewComplaint />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/reports" element={<AdminReports />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
