import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
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
      <Route path="/login" element={<Login />} />
      
      {/* Dashboard Routes wrapped in DashboardLayout AND Protected Route */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="student" replace />} />
        
        {/* Student Routes Foundational Skeleton */}
        <Route path="student" element={<StudentDashboard />} />
        <Route path="student/complaints" element={<ComplaintsList />} />
        <Route path="student/complaints/new" element={<NewComplaint />} />

        {/* Admin Routes Foundational Skeleton */}
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/reports" element={<AdminReports />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
