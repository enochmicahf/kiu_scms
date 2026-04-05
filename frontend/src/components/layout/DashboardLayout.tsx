import { Outlet, Link, useLocation } from 'react-router-dom';
import { LogOut, Bell, LayoutDashboard, FileText, PlusCircle, Settings, Users } from 'lucide-react';

export default function DashboardLayout() {
  const location = useLocation();

  // In a real app, this navigation would be filtered based on the logged-in user's role
  const navigation = [
    { name: 'Dashboard', href: '/dashboard/student', icon: LayoutDashboard },
    { name: 'My Complaints', href: '/dashboard/student/complaints', icon: FileText },
    { name: 'Submit Complaint', href: '/dashboard/student/complaints/new', icon: PlusCircle },
    { name: 'Admin Dashboard', href: '/dashboard/admin', icon: Users },
    { name: 'Reports Analytics', href: '/dashboard/admin/reports', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#08271c] text-gray-300 flex-shrink-0 flex flex-col">
        {/* User Card */}
        <div className="p-6 flex flex-col items-center border-b border-[#12553a]">
          <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden mb-3">
            <img src="https://ui-avatars.com/api/?name=Student+User&background=008540&color=fff" alt="User" />
          </div>
          <h3 className="text-white font-bold text-sm tracking-wide text-center uppercase">Student User</h3>
          <p className="text-xs text-primary-300 mt-1">Student</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          <div className="px-4 text-xs font-semibold text-primary-400 mb-2 uppercase tracking-wider">SCMS Menu</div>
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-6 py-3 text-sm transition-colors ${
                      isActive 
                        ? 'text-white border-l-4 border-white bg-[#104631]' 
                        : 'hover:text-white hover:bg-[#104631] border-l-4 border-transparent'
                    }`}
                  >
                    <item.icon className={`h-4 w-4 mr-3 ${isActive ? 'text-white' : 'text-primary-300'}`} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-[#008540] flex items-center justify-between px-6 border-b border-[#12553a] shadow-sm tracking-wide">
          <div className="flex items-center">
            <div className="text-white font-bold text-lg tracking-wider uppercase">
              KIU SCMS
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-primary-50">
            <button className="hover:text-white relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-0 right-0 block h-1.5 w-1.5 rounded-full bg-red-400 ring-2 ring-[#008540]" />
            </button>
            <button className="hover:text-white transition-colors">Change password</button>
            <Link to="/login" className="flex items-center hover:text-white transition-colors font-medium">
              Logout
              <LogOut className="h-4 w-4 ml-1.5" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-[#f8f9fa] p-6 text-gray-800">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
