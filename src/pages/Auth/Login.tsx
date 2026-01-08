import React, { useState, type JSX, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Toast from '@/components/GlobalComponents/Toast';

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'loading'>('success');
  const [showToast, setShowToast] = useState(false);
  const loginAttemptedRef = useRef(false);
  
  const { login, error, isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Debug logs
  useEffect(() => {
    // console.log('[Login] State updated:', {
    //   isAuthenticated,
    //   isLoading,
    //   user: user?.email,
    //   error,
    //   loginAttempted: loginAttemptedRef.current,
    // });
  }, [isAuthenticated, isLoading, user, error]);

  // Redirect to overview if already authenticated (only on mount, not during login attempt)
  useEffect(() => {
    if (isAuthenticated && !isLoading && !loginAttemptedRef.current) {
      // console.log('[Login] Redirecting to overview (already authenticated)');
      navigate('/overview', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Handle successful login redirect with toast
  useEffect(() => {
    // console.log('[Login] Success effect check:', {
    //   loginAttempted: loginAttemptedRef.current,
    //   isAuthenticated,
    //   hasUser: !!user,
    //   isLoading,
    // });

    if (loginAttemptedRef.current && isAuthenticated && user && !isLoading) {
      // console.log('[Login] Showing success toast and redirecting');
      setToastType('success');
      setToastMessage(`Welcome back, ${user.name}! 👋`);
      setShowToast(true);
      
      // Redirect after a short delay to let user see the success message
      const timer = setTimeout(() => {
        // console.log('[Login] Redirecting to overview');
        navigate('/overview', { replace: true });
      }, 1500);
      
      loginAttemptedRef.current = false;
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  // Show error toast when error occurs
  useEffect(() => {
    // console.log('[Login] Error check:', { error, loginAttempted: loginAttemptedRef.current });
    if (error) {
      // console.log('[Login] Showing error toast:', error);
      setToastMessage(error);
      setToastType('error');
      setShowToast(true);
      loginAttemptedRef.current = false;
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      // console.log('[Login] Empty email or password');
      return;
    }

    // console.log('[Login] Submitting form with email:', email);
    setShowToast(true);
    setToastType('loading');
    setToastMessage('Logging in...');
    loginAttemptedRef.current = true;

    try {
      // console.log('[Login] Calling login function');
      await login(email, password);
      // console.log('[Login] Login function completed successfully');
      // Success handling is done in the useEffect that watches isAuthenticated
    } catch (err) {
      // console.error('[Login] Login function threw error:', err);
      // Error is already set in AuthContext, toast will show via useEffect above
      // Don't hide toast here - let the error effect show it
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover relative" style={{ backgroundImage: `url('/image/bg-image.png')` }}>
      <div className="absolute inset-0 bg-black/50" />

      {/* Toast Notification */}
      <Toast 
        message={toastMessage}
        type={toastType}
        show={showToast}
        onHide={() => setShowToast(false)}
      />

      <div className="z-10 relative w-full max-w-[520px] mx-4">
        <div className="bg-white rounded-[30px] shadow-xl border border-[#E8ECEF] p-8 lg:p-[60px]">
          <div className="flex flex-col items-center gap-[10px]">
            <img src="/logo.svg" alt="Euracare" className="lg:w-[220px] lg:h-auto" />

            <h2 className="text-[18px] lg:text-[20px] font-medium text-[#010101] tracking-[-0.2px]">Welcome Back</h2>
            <p className="text-[14px] text-[#010101] text-center leading-[20px] max-w-[420px]">
              Access your hospital management dashboard to oversee operations, monitor staff activities, and manage patient records securely.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 lg:mt-[36px]">
            <div className='flex flex-col gap-[12px]'>
              <div>
                <label className="block text-[14px] leading-[24px] text-[#010101] mb-0">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-[6px] border border-[#01010133] px-3 py-[8px] leading-[24px] text-[14px] focus:outline-none focus:ring-1 focus:ring-[#0C2141]"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-[14px] leading-[24px] text-[#010101] mb-0">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-[6px] border border-[#01010133] px-3 py-[8px] leading-[24px] text-sm focus:outline-none focus:ring-1 focus:ring-[#0C2141]"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#010101] text-sm"
                    disabled={isLoading}
                  >
                    {showPassword ? <img src="/icon/hide.png" alt="" className='w-[17px]'/> : <img src="/icon/view.png" alt="" className='w-[17px]'/> }
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-[10px]">
              <div />
              <Link 
                to="/auth/reset-password" 
                className="text-[#0C2141] font-semibold leading-[24px] text-[14px] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full mt-4 lg:mt-[30px] inline-flex items-center justify-center rounded-[30px] bg-[#0C2141] text-white px-6 py-[12px] leading-[24px] text-sm font-medium shadow-sm hover:bg-[#0C2141]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
