import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import DashboardLayout from '../components/layout/DashboardLayout';
import StudentProfile from '../pages/dashboard/StudentProfile';
import ProtectedRoute from '../components/layout/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      
      {/* Dashboard Routes wrapped in DashboardLayout AND Protected Route */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<StudentProfile />} />
        <Route path="courses" element={<div className="p-4 text-gray-500">Courses Feature Pending...</div>} />
        <Route path="results" element={<div className="p-4 text-gray-500">Results Feature Pending...</div>} />
        <Route path="exams" element={<div className="p-4 text-gray-500">Special Exams Feature Pending...</div>} />
        <Route path="financial" element={<div className="p-4 text-gray-500">Financial Feature Pending...</div>} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
