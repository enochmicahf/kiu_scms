import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import api from '../../lib/api';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
});
type ForgotForm = z.infer<typeof schema>;

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ForgotForm) => {
    setApiError('');
    try {
      await api.post('/auth/forgot-password', data);
      setSubmitted(true);
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Something went wrong. Please try again.');
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
              <h1 className="text-lg font-bold text-gray-900 uppercase tracking-widest">Password Recovery</h1>
              <p className="text-[11px] text-gray-500 font-semibold tracking-[0.15em] uppercase mt-0.5">SCMS — Complaint Management System</p>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center text-center py-4">
                <CheckCircle className="h-12 w-12 text-[#008540] mb-4" />
                <h2 className="text-base font-bold text-gray-800 mb-2">Check Your Email</h2>
                <p className="text-sm text-gray-600 mb-6">If an account exists with that email, a password reset link has been sent.</p>
                <Link to="/login" className="text-sm text-[#008540] font-semibold hover:underline flex items-center gap-1">
                  <ArrowLeft className="h-4 w-4" /> Back to Sign In
                </Link>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-5 text-center">
                  Enter your registered email address and we'll send you a link to reset your password.
                </p>

                {apiError && (
                  <div className="mb-4 flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{apiError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      {...register('email')}
                      className={`w-full px-3.5 py-3 border text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-[#008540]/30 focus:border-[#008540] transition-colors ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
                      placeholder="you@kiu.ac.ug"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-[#008540] hover:bg-[#006830] disabled:bg-gray-400 text-white text-sm font-semibold rounded-sm transition-colors tracking-wide uppercase"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/login" className="text-sm text-gray-500 hover:text-[#008540] flex items-center justify-center gap-1 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Sign In
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
