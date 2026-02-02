import React, { useState, type JSX } from 'react';
import { Link } from 'react-router-dom';

export default function LoginPage(): JSX.Element {
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: wire auth
    };

    return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover relative" style={{ backgroundImage: `url('/image/bg-image.png')` }}>
            <div className="absolute inset-0 bg-black/50" />

            <div className="z-10 relative w-full max-w-[520px] mx-4">
                <div className="bg-white rounded-[30px] shadow-xl border border-[#E8ECEF] p-8 lg:p-[60px]">
                    <div className="flex flex-col items-center gap-[10px]">
                        <div className="flex items-start gap-4 mb-[10px]">
                            <Link to="/login" className="inline-flex items-center justify-center">
                                <img src="/icon/back.svg" alt="back" className="" />
                            </Link>
                            <div className="flex-1 text-center">
                                <img src="/logo.svg" alt="Euracare" className="mx-auto lg:w-[270px] lg:h-auto" />
                            </div>
                            <div className="w-9 h-9" />
                        </div>

                        <h2 className="text-[18px] lg:text-[20px] font-medium text-[#010101] tracking-[-0.2px]">Create a New Password</h2>
                        <p className="text-[14px] text-[#010101] text-center leading-[20px] max-w-[420px]">
                            Choose a strong password to keep your account secure.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6 lg:mt-[60px]">
                        <div className='flex flex-col gap-[12px]'>
                            <div>
                                <label className="block text-[14px] leading-[24px] text-[#010101] mb-0">New Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full rounded-[6px] border border-[#01010133] px-3 py-[8px] leading-[24px] text-[14px] focus:outline-none focus:ring-1 focus:ring-[#0C2141]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[14px] leading-[24px] text-[#010101] mb-0">Confirm New Password</label>
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

                        <button
                            type="submit"
                            className="w-full mt-4 lg:mt-[92px] inline-flex items-center justify-center rounded-[30px] bg-[#0C2141] text-white px-6 py-[12px] leading-[24px] text-sm font-medium shadow-sm"
                        >
                            Confirm
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
