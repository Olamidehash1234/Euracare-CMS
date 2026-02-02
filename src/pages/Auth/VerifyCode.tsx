import React, { useRef, useState, type JSX } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function VerifyCode(): JSX.Element {
    const navigate = useNavigate();
    const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const focusInput = (index: number) => {
        inputsRef.current[index]?.focus();
        inputsRef.current[index]?.select();
    };

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // only digits
        const v = value.slice(-1); // only keep last entered char
        setDigits(prev => {
            const next = [...prev];
            next[index] = v;
            return next;
        });
        if (v && index < inputsRef.current.length - 1) {
            focusInput(index + 1);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Backspace') {
            if (digits[index]) {
                // clear current
                setDigits(prev => {
                    const next = [...prev];
                    next[index] = '';
                    return next;
                });
            } else if (index > 0) {
                focusInput(index - 1);
                setDigits(prev => {
                    const next = [...prev];
                    next[index - 1] = '';
                    return next;
                });
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            focusInput(index - 1);
        } else if (e.key === 'ArrowRight' && index < inputsRef.current.length - 1) {
            focusInput(index + 1);
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (!text) return;
        const chars = text.split('');
        setDigits(prev => {
            const next = [...prev];
            for (let i = 0; i < 6; i++) next[i] = chars[i] ?? '';
            return next;
        });
        const last = Math.min(text.length - 1, 5);
        focusInput(last + 0);
        e.preventDefault();
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const code = digits.join('');
        if (code.length < 6) {
            setMessage('Please enter a 6-digit code.');
            return;
        }
        setSubmitting(true);
        setMessage(null);
        // simulate verification
        await new Promise(res => setTimeout(res, 600));
        setSubmitting(false);
        // navigate to overview or next step
        navigate('/update-password');
    };

    const handleResend = () => {
        setMessage('Verification code resent. Check your email.');
        // Mock resend delay
        setTimeout(() => setMessage(null), 4000);
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
                            <img src="/logo.svg" alt="Euracare" className="mx-auto lg:w-[270px] lg:h-auto" />
                        </div>
                        <div className="w-9 h-9" />
                    </div>

                    <h2 className="text-[18px] lg:text-[20px] font-semibold text-[#010101] text-center mb-[10px]">Enter verification code</h2>
                    <p className="text-sm lg:text-[14px] leading-[20px] text-[#010101] text-center mx-auto mb-6 max-w-[380px]">
                        We have sent a 6-digit verification code to your email. Enter the code to continue.
                    </p>

                    <form onSubmit={handleSubmit} onPaste={handlePaste} className="mt-4 lg:mt-[80px]">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            {digits.map((d, i) => (
                                <input
                                    key={i}
                                    ref={el => { inputsRef.current[i] = el; }}
                                    inputMode="numeric"
                                    pattern="\d*"
                                    maxLength={1}
                                    value={d}
                                    onChange={(ev) => handleChange(i, ev.target.value)}
                                    onKeyDown={(ev) => handleKeyDown(ev, i)}
                                    className="w-12 h-12 lg:w-14 lg:h-14 border-b-[2px] lg:text-[32px] border-[#141B34] text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#0C2141]"
                                />
                            ))}
                        </div>

                        {message && <div className="text-center text-sm text-rose-600 mb-3">{message}</div>}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full mt-2 lg:mt-[110px] inline-flex items-center justify-center rounded-[30px] bg-[#0C2141] text-white px-6 py-[12px] leading-[24px] text-sm font-medium shadow-sm"
                        >
                            {submitting ? 'Verifying...' : 'Verify Code'}
                        </button>

                        <div className="mt-4 text-center text-sm">
                            <span>Didn't receive a code? </span>
                            <button type="button" onClick={handleResend} className="text-[#0C2141] font-medium hover:underline">
                                Resend code
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
