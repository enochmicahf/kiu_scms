import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from '../components/layout/ProtectedRoute';

// Foundational SCMS Pages
// Foundational SCMS Pages
import StudentDashboard from '../pages/dashboard/StudentDashboard';
import ComplaintList from '../pages/complaints/ComplaintList';
import NewComplaint from '../pages/complaints/NewComplaint';
import ComplaintDetail from '../pages/complaints/ComplaintDetail';
import ComplaintsList from '../pages/dashboard/ComplaintsList';
import StaffDashboard from '../pages/dashboard/StaffDashboard';
import StaffComplaintWorkspace from '../pages/dashboard/StaffComplaintWorkspace';

// Phase 5: Administrative Control Panel
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';
import OrgManagement from '../pages/admin/OrgManagement';
import SystemConfig from '../pages/admin/SystemConfig';
import AuditLogs from '../pages/admin/AuditLogs';
import ReportsOverview from '../pages/admin/ReportsOverview';

import { useAuth } from '../context/AuthContext';

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'Admin') return <Navigate to="/dashboard/admin" replace />;
  if (user.role === 'Staff') return <Navigate to="/dashboard/staff" replace />;
  return <Navigate to="/dashboard/student" replace />;
}

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
        <Route index element={<RoleRedirect />} />
        
        {/* Student Routes */}
        <Route path="student" element={
          <ProtectedRoute allowedRoles={['Student']}><StudentDashboard /></ProtectedRoute>
        } />
        <Route path="student/complaints" element={
          <ProtectedRoute allowedRoles={['Student']}><ComplaintList /></ProtectedRoute>
        } />
        <Route path="student/complaints/new" element={
          <ProtectedRoute allowedRoles={['Student']}><NewComplaint /></ProtectedRoute>
        } />
        <Route path="student/complaints/:id" element={
          <ProtectedRoute allowedRoles={['Student']}><ComplaintDetail /></ProtectedRoute>
        } />
        
        {/* Administrative Management Routes */}
        <Route path="admin" element={
          <ProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="admin/complaints" element={
          <ProtectedRoute allowedRoles={['Admin']}><ComplaintsList /></ProtectedRoute>
        } />
        <Route path="admin/users" element={
          <ProtectedRoute allowedRoles={['Admin']}><UserManagement /></ProtectedRoute>
        } />
        <Route path="admin/org" element={
          <ProtectedRoute allowedRoles={['Admin']}><OrgManagement /></ProtectedRoute>
        } />
        <Route path="admin/config" element={
          <ProtectedRoute allowedRoles={['Admin']}><SystemConfig /></ProtectedRoute>
        } />
        <Route path="admin/logs" element={
          <ProtectedRoute allowedRoles={['Admin']}><AuditLogs /></ProtectedRoute>
        } />
        <Route path="admin/reports" element={
          <ProtectedRoute allowedRoles={['Admin']}><ReportsOverview /></ProtectedRoute>
        } />

        {/* Staff Specific Routes */}
        <Route path="staff" element={
          <ProtectedRoute allowedRoles={['Staff']}><StaffDashboard /></ProtectedRoute>
        } />
        <Route path="staff/worklist" element={
          <ProtectedRoute allowedRoles={['Staff']}><ComplaintsList /></ProtectedRoute>
        } />
        <Route path="staff/complaints/:id" element={
          <ProtectedRoute allowedRoles={['Staff']}><StaffComplaintWorkspace /></ProtectedRoute>
        } />

      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
