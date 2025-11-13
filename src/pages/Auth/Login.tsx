import React, { useState, type JSX } from 'react';
import { Link } from 'react-router-dom';

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire auth
    console.log('login attempt', { email, password });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover relative" style={{ backgroundImage: `url('/image/bg-image.png')` }}>
      <div className="absolute inset-0 bg-black/50" />

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
                />
              </div>

              <div>
                <label className="block text-[14px] leading-[24px] text-[#010101] mb-0">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-[6px] border border-[#01010133] px-3 py-[8px] leading-[24px] text-sm focus:outline-none focus:ring-1 focus:ring-[#0C2141]"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-[10px]">
              <div />
              <Link to="/reset-password" className="text-[#0C2141] font-semibold leading-[24px] text-[14px] hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full mt-4 lg:mt-[30px] inline-flex items-center justify-center rounded-[30px] bg-[#0C2141] text-white px-6 py-[12px] leading-[24px] text-sm font-medium shadow-sm"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
