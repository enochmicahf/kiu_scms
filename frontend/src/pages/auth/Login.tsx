import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or registration number is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setApiError('');
    try {
      const res = await api.post('/auth/login', data);
      if (res.data.status === 'success') {
        login(res.data.token, res.data.user);
        navigate('/dashboard/student');
      }
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative bg-gray-900"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 w-full max-w-[460px] mx-4">
        {/* Card */}
        <div className="bg-white shadow-2xl">
          {/* Green top bar */}
          <div className="h-1.5 bg-[#008540]" />

          <div className="px-10 py-10">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-end text-[#008540] mb-3">
                <svg width="52" height="52" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 22H6V14H4V22ZM18 22H20V6H18V22ZM11 22H13V10H11V22Z"/>
                </svg>
                <div className="ml-2 font-extrabold leading-tight uppercase">
                  <div className="text-3xl tracking-tight">KIU</div>
                </div>
                <div className="ml-2 text-[9px] flex flex-col justify-end pb-1 font-semibold leading-tight text-[#008540]">
                  <span>KAMPALA</span>
                  <span>INTERNATIONAL</span>
                  <span>UNIVERSITY</span>
                </div>
              </div>
              <h1 className="text-xl font-bold text-gray-900 uppercase tracking-widest mt-1">SCMS</h1>
              <p className="text-[11px] text-gray-500 font-semibold tracking-[0.2em] uppercase mt-0.5">
                Complaint Management System
              </p>
            </div>

            {/* API Error */}
            {apiError && (
              <div className="mb-5 flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Identifier */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                  Email or Registration Number
                </label>
                <input
                  type="text"
                  autoComplete="username"
                  {...register('identifier')}
                  className={`w-full px-3.5 py-3 border text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-[#008540]/30 focus:border-[#008540] transition-colors ${
                    errors.identifier ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="e.g. 2100700123 or admin@kiu.ac.ug"
                />
                {errors.identifier && (
                  <p className="mt-1 text-xs text-red-600">{errors.identifier.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-[#008540] hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    {...register('password')}
                    className={`w-full px-3.5 py-3 border text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-[#008540]/30 focus:border-[#008540] transition-colors pr-10 ${
                      errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-[#008540] hover:bg-[#006830] disabled:bg-gray-400 text-white text-sm font-semibold rounded-sm transition-colors mt-2 tracking-wide uppercase"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Register link */}
            <div className="mt-7 text-center border-t border-gray-100 pt-6">
              <p className="text-sm text-gray-500 mb-2">Requester / Don't have an account?</p>
              <Link
                to="/register"
                className="inline-block text-sm font-semibold text-[#008540] hover:text-[#006830] hover:underline transition-colors"
              >
                Register for SCMS →
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-white/50 text-xs mt-5">
          © {new Date().getFullYear()} Kampala International University. All rights reserved.
        </p>
      </div>
    </div>
  );
}
