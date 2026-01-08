import React, { useState, type JSX } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ResetPassword(): JSX.Element {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: send reset link
        // console.log('send reset link to', email);
        navigate('/verify-code');
    };

    return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover relative" style={{ backgroundImage: `url('/image/bg-image.png')` }}>
            <div className="absolute inset-0 bg-black/50" />

            <div className="relative z-10 w-full max-w-[520px] mx-4">
                <div className="bg-white rounded-[30px] shadow-2xl border border-[#ECEFF2] p-6 lg:p-[60px]">
                    <div className="flex items-start gap-4 mb-[10px]">
                        <Link to="/login" className="inline-flex items-center justify-center">
                            <img src="/icon/back.svg" alt="back" className="" />
                        </Link>
                        <div className="flex-1 text-center">
                            <img src="/logo.svg" alt="Euracare" className="mx-auto lg:w-[220px] lg:h-auto" />
                        </div>
                        <div className="w-9 h-9" />
                    </div>

                    <h2 className="text-[18px] lg:text-[20px] font-semibold text-[#010101] text-center mb-2">Reset Your Password</h2>
                    <p className="text-sm lg:text-[14px] leading-[20px] text-[#010101] text-center mx-auto mb-6">
                        Enter the email address linked to your admin account, and we’ll send you a secure link to reset your password.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-4 lg:mt-[80px]">
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
                        <a href="/verify-code">
                            <button type="submit" className="w-full mt-4 lg:mt-[120px] inline-flex items-center justify-center rounded-[30px] bg-[#0C2141] text-white px-6 py-[12px] leading-[24px] text-sm font-medium shadow-sm">
                                Send Reset Link
                            </button>
                        </a>
                    </form>
                </div>
            </div>
        </div>
    );
}
