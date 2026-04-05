import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('admin123'); // Demo default
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (identifier) {
      try {
        const res = await api.post('/auth/login', { identifier, password });
        if (res.data.status === 'success') {
           localStorage.setItem('token', res.data.token);
           localStorage.setItem('user', JSON.stringify(res.data.user));
           navigate('/dashboard');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Login failed. Try admin@kiu.ac.ug / admin123');
      }
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gray-200 bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[480px] bg-white p-10 md:p-14 shadow-2xl">
        
        {/* Logo Placeholder (SVGs matching the reference closely) */}
        <div className="flex flex-col items-center mb-6">
          <div className="text-primary-700 flex items-end mb-4 cursor-default">
            {/* Very simple SVG mimicking a giraffe and KIU */}
            <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 22H6V14H4V22ZM18 22H20V6H18V22ZM11 22H13V10H11V22Z"/>
            </svg>
            <div className="ml-2 font-bold leading-tight uppercase">
              <div className="text-3xl tracking-tighter">KIU</div>
            </div>
            <div className="ml-2 text-xs flex flex-col justify-end pb-1 font-medium leading-none">
              <span>KAMPALA</span>
              <span>INTERNATIONAL</span>
              <span>UNIVERSITY</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 text-center uppercase tracking-wide mt-2">SCMS</h2>
          <p className="text-sm text-gray-500 font-medium tracking-wider">COMPLAINT MANAGEMENT SYSTEM</p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleNext} className="space-y-6">
          <div>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                setError('');
              }}
              className="w-full px-3 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm mb-4"
              placeholder="Email or Registration number"
            />
            
            {/* Hidden field for password just to satisfy state logic for demo */}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="hidden"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#008540] hover:bg-primary-800 text-white text-sm font-medium rounded-sm transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-sm text-gray-600 leading-relaxed text-center">
          <p className="mb-2">Requester / Don't have an account?</p>
          <button className="text-[#008540] font-semibold hover:underline">
            Register for SCMS
          </button>
        </div>
      </div>
    </div>
  );
}
