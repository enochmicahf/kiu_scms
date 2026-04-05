import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../../lib/api';

const schema = z.object({
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ResetForm = z.infer<typeof schema>;

export default function ResetPassword() {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const [apiError, setApiError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ResetForm) => {
    setApiError('');
    try {
      await api.post('/auth/reset-password', { token, newPassword: data.newPassword });
      setDone(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Failed to reset password. Link may have expired.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative z-10 w-full max-w-[440px] mx-4">
        <div className="bg-white shadow-2xl">
          <div className="h-1.5 bg-[#008540]" />
          <div className="px-10 py-10">
            <div className="flex flex-col items-center mb-7">
              <div className="flex items-end text-[#008540] mb-3">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 22H6V14H4V22ZM18 22H20V6H18V22ZM11 22H13V10H11V22Z"/>
                </svg>
                <div className="ml-1.5 font-extrabold uppercase text-2xl tracking-tight">KIU</div>
              </div>
              <h1 className="text-lg font-bold text-gray-900 uppercase tracking-widest">Reset Password</h1>
              <p className="text-[11px] text-gray-500 font-semibold tracking-[0.15em] uppercase mt-0.5">SCMS — Complaint Management System</p>
            </div>

            {done ? (
              <div className="flex flex-col items-center text-center py-4">
                <CheckCircle className="h-12 w-12 text-[#008540] mb-4" />
                <h2 className="text-base font-bold text-gray-800 mb-2">Password Updated!</h2>
                <p className="text-sm text-gray-600 mb-1">Your password has been reset successfully.</p>
                <p className="text-xs text-gray-400">Redirecting to Sign In...</p>
              </div>
            ) : (
              <>
                {!token && (
                  <div className="mb-4 flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 px-4 py-3 rounded">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Invalid or missing reset token. Please request a new reset link.</span>
                  </div>
                )}

                {apiError && (
                  <div className="mb-4 flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{apiError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">New Password</label>
                    <div className="relative">
                      <input
                        type={showNew ? 'text' : 'password'}
                        {...register('newPassword')}
                        className={`w-full px-3.5 py-3 border text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-[#008540]/30 focus:border-[#008540] transition-colors pr-10 ${errors.newPassword ? 'border-red-400' : 'border-gray-300'}`}
                        placeholder="New password"
                      />
                      <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.newPassword && <p className="mt-1 text-xs text-red-600">{errors.newPassword.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        {...register('confirmPassword')}
                        className={`w-full px-3.5 py-3 border text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-[#008540]/30 focus:border-[#008540] transition-colors pr-10 ${errors.confirmPassword ? 'border-red-400' : 'border-gray-300'}`}
                        placeholder="Confirm new password"
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !token}
                    className="w-full py-3 px-4 bg-[#008540] hover:bg-[#006830] disabled:bg-gray-400 text-white text-sm font-semibold rounded-sm transition-colors tracking-wide uppercase"
                  >
                    {isSubmitting ? 'Updating...' : 'Update Password'}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/login" className="text-sm text-gray-500 hover:text-[#008540] transition-colors">
                    Back to Sign In
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
        <p className="text-center text-white/50 text-xs mt-5">
          © {new Date().getFullYear()} Kampala International University. All rights reserved.
        </p>
      </div>
    </div>
  );
}
