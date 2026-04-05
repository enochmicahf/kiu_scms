import { Outlet, Link, useLocation } from 'react-router-dom';
import { LogOut, Bell, BookOpen, FileText, FileWarning, DollarSign, User } from 'lucide-react';

export default function DashboardLayout() {
  const location = useLocation();

  const navigation = [
    { name: 'Profile', href: '/dashboard', icon: User },
    { name: 'Courses', href: '/dashboard/courses', icon: BookOpen },
    { name: 'Results', href: '/dashboard/results', icon: FileText },
    { name: 'Special exams requests', href: '/dashboard/exams', icon: FileWarning },
    { name: 'Financial Account', href: '/dashboard/financial', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#333333] text-gray-300 flex-shrink-0 flex flex-col">
        {/* User Card */}
        <div className="p-6 flex flex-col items-center border-b border-gray-700">
          <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden mb-3">
            <img src="https://ui-avatars.com/api/?name=Benjamin+Angella&background=random" alt="User" />
          </div>
          <h3 className="text-white font-bold text-sm tracking-wide text-center uppercase">BENJAMIN<br/>ANGELLA</h3>
          <p className="text-xs text-gray-400 mt-1">Student</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          <div className="px-4 text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">MAIN</div>
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-6 py-3 text-sm transition-colors ${
                      isActive 
                        ? 'text-white border-l-4 border-[#3dbe6b] bg-[#2a2a2a]' 
                        : 'hover:text-white hover:bg-[#2a2a2a] border-l-4 border-transparent'
                    }`}
                  >
                    <item.icon className={`h-4 w-4 mr-3 ${isActive ? 'text-[#3dbe6b]' : 'text-gray-400'}`} />
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
        <header className="h-16 bg-[#333333] flex items-center justify-between px-6 border-b border-gray-700">
          <div className="flex items-center">
            <div className="text-[#3dbe6b] font-semibold text-lg tracking-wider uppercase">
              STUDENT PORTAL
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-300">
            <button className="hover:text-white relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-0 right-0 block h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-[#333333]" />
            </button>
            <button className="hover:text-white">Change password</button>
            <Link to="/login" className="flex items-center hover:text-white">
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
