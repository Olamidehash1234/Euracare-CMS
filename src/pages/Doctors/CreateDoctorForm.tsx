import React, { useState, useRef } from 'react';

export type NewDoctorPayload = {
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
  languages: string[];
  regNumber?: string;
  yearsExperience?: string;
  bio?: string;
  avatar?: string;
  programs?: string[];
  researchInterests?: string[];
  qualifications?: string[];
  trainings?: string[];
};

type FormState = {
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
  languages: string[];
  languageInput: string;
  regNumber: string;
  yearsExperience: string;
  bio: string;
};

interface DoctorFormProps {
  mode?: 'create' | 'edit';
  initialData?: NewDoctorPayload;
  onSave: (payload: NewDoctorPayload) => void;
  onClose: () => void;
}

export default function DoctorForm({ mode = 'create', initialData, onClose }: DoctorFormProps): React.ReactElement {
    const [form, setForm] = useState<FormState>({
        fullName: initialData?.fullName || '',
        email: initialData?.email || '',
        countryCode: '+234',
        phone: initialData?.phone || '',
        languages: initialData?.languages || [],
        languageInput: '',
        regNumber: initialData?.regNumber || '',
        yearsExperience: initialData?.yearsExperience || '',
        bio: initialData?.bio || '',
    });

    const fileRef = useRef<HTMLInputElement | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    // Professional information states
    const [programInput, setProgramInput] = useState<string>('');
    const [programs, setPrograms] = useState<string[]>([]);

    const [researchInput, setResearchInput] = useState<string>('');
    const [researchInterests, setResearchInterests] = useState<string[]>([]);

    const [qualificationInput, setQualificationInput] = useState<string>('');
    const [qualifications, setQualifications] = useState<string[]>([]);

    const [trainingInput, setTrainingInput] = useState<string>('');
    const [trainings, setTrainings] = useState<string[]>([
    ]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const target = e.target as HTMLInputElement;
        const { name, value } = target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddLanguage = (): void => {
        const v = form.languageInput.trim();
        if (!v) return;
        if (form.languages.includes(v)) {
            setForm(prev => ({ ...prev, languageInput: '' }));
            return;
        }
        setForm(prev => ({ ...prev, languages: [...prev.languages, v], languageInput: '' }));
    };

    const handleRemoveLanguage = (lang: string): void => {
        setForm(prev => ({ ...prev, languages: prev.languages.filter(l => l !== lang) }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setAvatarPreview(url);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        // assemble payload
        const payload = {
            ...form,
            avatar: avatarPreview,
            programs,
            researchInterests,
            qualifications,
            trainings,
        };
        console.log('payload', payload);
        // replace with real submit logic
        alert('Submitted — check console for payload');
    };

    // Professional info handlers (typed)
    const addProgram = (): void => {
        const v = programInput.trim();
        if (!v) return;
        if (!programs.includes(v)) setPrograms(prev => [...prev, v]);
        setProgramInput('');
    };
    const removeProgram = (p: string): void => setPrograms(prev => prev.filter(x => x !== p));

    const addResearch = (): void => {
        const v = researchInput.trim();
        if (!v) return;
        if (!researchInterests.includes(v)) setResearchInterests(prev => [...prev, v]);
        setResearchInput('');
    };
    const removeResearch = (r: string): void => setResearchInterests(prev => prev.filter(x => x !== r));

    const addQualification = (): void => {
        const v = qualificationInput.trim();
        if (!v) return;
        if (!qualifications.includes(v)) setQualifications(prev => [...prev, v]);
        setQualificationInput('');
    };
    const removeQualification = (q: string): void => setQualifications(prev => prev.filter(x => x !== q));

    const addTraining = (): void => {
        const v = trainingInput.trim();
        if (!v) return;
        if (!trainings.includes(v)) setTrainings(prev => [...prev, v]);
        setTrainingInput('');
    };
    const removeTraining = (t: string): void => setTrainings(prev => prev.filter(x => x !== t));

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="">
                <a href="/doctors" className="inline-flex items-center text-[#0C2141] text-sm lg:text-[16px] font-medium mb-4 lg:mb-[30px] lg:leading-[140%] gap-[4px]"><img src="/icon/right.svg" alt="" /> Back to Doctor's Page</a>

                <div className="bg-white rounded-xl border border-[#B9B9B9] overflow-hidden">
                    <div className="px-6 lg:px-[30px] py-5 lg:py-[20px] border-b border-[#0000001A]">
                        <h1 className="text-lg lg:text-[20px] text-[#010101] font-medium">
                            {mode === 'create' ? 'Create' : 'Edit'} Doctor's Profile
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 sm:px-[25px] sm:py-[20px]">
                        <div className="flex gap-6 items-start mb-6">
                            {/* Avatar */}
                            <div className="flex-shrink-0 justify-center flex flex-col items-center">
                                <div className="w-24 h-24 z-30 lg:w-[100px] lg:h-[100px] rounded-full bg-slate-100 flex items-center justify-center overflow-hidden relative">
                                    {avatarPreview ? (
                                        // eslint-disable-next-line
                                        <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-[#01010180]"><img src="/image/doctor/test.png" alt="" /></div>
                                    )}
                                </div>

                                <label
                                    htmlFor="avatar"
                                    className="mt-[-1px] z-10 inline-block text-[10px] bg-[#0C2141] text-[#F8F8F8] px-3 lg:px-[17px] py-[5px] rounded-full cursor-pointer text-center shadow-sm"
                                >
                                    Tap to change image
                                </label>
                                <input
                                    id="avatar"
                                    ref={fileRef}
                                    onChange={handleAvatarChange}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>

                            {/* Keep avatar alignment */}
                            <div className="flex-1" />
                        </div>

                        {/* Inner card */}
                        <div className="border rounded-[10px] border-[#0101011A] p-5 lg:p-[18px]">
                            <h2 className="font-medium text-sm lg:text-[16px] lg:mb-[30px] mb-4">Basic Information</h2>

                            {/* Grid: 1 col mobile, 2 md, 3 lg */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-[30px] gap-y-4">
                                {/* Full name */}
                                <div>
                                    <label className="block text-[14px] text-[#010101] mb-2">Full Name</label>
                                    <input
                                        name="fullName"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        className="w-full rounded-[6px] border border-[#01010133] px-3 py-[8px] text-sm placeholder-[#01010180] lg:leading-[24px]  focus:outline-none"
                                        placeholder="Shai Hulud"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-[14px] text-[#010101] mb-2">Email Address</label>
                                    <input
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        type="email"
                                        className="w-full rounded-md border border-[#01010133] px-3 py-[8px] text-sm placeholder-[#01010180] lg:leading-[24px]  focus:outline-none"
                                        placeholder="shaihuld@gmail.com"
                                    />
                                </div>

                                {/* Phone with country select */}
                                <div>
                                    <label className="block text-[14px] text-[#010101] mb-2">Phone Number</label>
                                    <div className="flex gap-2">
                                        <button type="button" className="flex items-center gap-2 border border-[#01010133] rounded-md px-3 py-[8px] text-sm">
                                            <span className="text-[18px] leading-none"></span>
                                            <span className="text-[14px]">{form.countryCode}</span>
                                            <svg className="w-3 h-3 ml-1" viewBox="0 0 20 20" fill="none"><path d="M6 8l4 4 4-4" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        </button>

                                        <input
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            className="flex-1 rounded-md border border-[#01010133] px-3 py-[8px] text-sm placeholder-[#01010180] lg:leading-[24px]  focus:outline-none"
                                            placeholder="701 234 5678"
                                        />
                                    </div>
                                </div>

                                {/* Languages spoken */}
                                <div className="md:col-span-1 lg:col-span-1">
                                    <label className="block text-[14px] text-[#010101] mb-2">Languages Spoken</label>
                                    <div className="flex gap-2">
                                        <input
                                            name="languageInput"
                                            value={form.languageInput}
                                            onChange={e => setForm(prev => ({ ...prev, languageInput: e.target.value }))}
                                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddLanguage(); } }}
                                            placeholder="Pick All That Applies"
                                            className="w-full rounded-md border border-[#01010133] px-3 py-[8px] text-sm placeholder-[#01010180] lg:leading-[24px]  focus:outline-none"
                                        />
                                        {/* <button type="button" onClick={handleAddLanguage} className="px-3 py-[8px] text-sm rounded-md border border-[#01010133]">Add</button> */}
                                    </div>

                                    <div className="flex gap-2 mt-[8px] flex-wrap">
                                        {form.languages.map(lang => (
                                            <span key={lang} className="inline-flex items-center gap-2 border border-[#0C2141] rounded-full px-3 py-1 lg:py-[4px] text-[14px] text-[#010101CC] lg:leading-[24px]">
                                                <span>{lang}</span>
                                                <button type="button" onClick={() => handleRemoveLanguage(lang)} className="text-[#01010180]"><img src="/icon/cancel.svg" alt="" /></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Reg Number */}
                                <div>
                                    <label className="block text-[14px] text-[#010101] mb-2">Reg Number</label>
                                    <input
                                        name="regNumber"
                                        value={form.regNumber}
                                        onChange={handleChange}
                                        className="w-full rounded-md border border-[#01010133] px-3 py-[8px] text-sm placeholder-[#01010180] lg:leading-[24px]  focus:outline-none"
                                        placeholder="RC3456KSV"
                                    />
                                </div>

                                {/* Years Experience */}
                                <div>
                                    <label className="block text-[14px] text-[#010101] mb-2">Years of Experience</label>
                                    <input
                                        name="yearsExperience"
                                        value={form.yearsExperience}
                                        onChange={handleChange}
                                        className="w-full rounded-md border border-[#01010133] px-3 py-[8px] text-sm placeholder-[#01010180] lg:leading-[24px]  focus:outline-none"
                                        placeholder="20 years"
                                    />
                                </div>
                            </div>

                            {/* Doctor's Bio - full width */}
                            <div className="mt-5">
                                <label className="block text-[14px] text-[#010101] mb-2">Doctor's Bio</label>
                                <textarea
                                    name="bio"
                                    value={form.bio}
                                    onChange={handleChange}
                                    rows={6}
                                    placeholder="Writeup about the Doctor"
                                    className="w-full rounded-md border border-[#01010133] px-3 py-[8px] text-sm placeholder-[#01010180] lg:leading-[24px]  focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* NEW: Professional Information section (added below existing form) */}
                            <div className="mt-8 border rounded-[10px] border-[#0101011A] p-5 lg:p-[18px]">
                                <h3 className="font-medium text-sm lg:text-[16px] mb-4">Professional Information</h3>

                                {/* Programs & Specialties */}
                                <div className="mb-6">
                                    <label className="block text-[14px] text-[#010101] mb-2">Programs & Specialties</label>
                                    <input
                                        value={programInput}
                                        onChange={(e) => setProgramInput(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addProgram(); } }}
                                        placeholder="Type here"
                                        className="w-full rounded-md border border-[#01010133] px-3 mb-[8px] py-[8px] text-sm placeholder-[#01010180] lg:leading-[24px]  focus:outline-none"
                                    />
                                    <div className="flex gap-2 flex-wrap">
                                        {programs.map(p => (
                                            <span key={p} className="inline-flex items-center gap-2 border border-[#0C2141] rounded-full px-3 py-1 lg:py-[4px] text-[14px] text-[#010101CC] lg:leading-[24px]">
                                                <span>{p}</span>
                                                <button type="button" onClick={() => removeProgram(p)} className="text-[#01010180]"><img src="/icon/cancel.svg" alt="" /></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Research Interest */}
                                <div className="mb-6">
                                    <label className="block text-[14px] text-[#010101] mb-2">Research Interest</label>
                                    <input
                                        value={researchInput}
                                        onChange={(e) => setResearchInput(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addResearch(); } }}
                                        placeholder="Specialties"
                                        className="w-full rounded-md border border-[#01010133] mb-[8px] px-3 py-[8px] text-sm placeholder-[#01010180] lg:leading-[24px]  focus:outline-none"
                                    />
                                    <div className="flex gap-2 flex-wrap">
                                        {researchInterests.map(r => (
                                            <span key={r} className="inline-flex items-center gap-2 border border-[#0C2141] rounded-full px-3 py-1 lg:py-[4px] text-[14px] text-[#010101CC]">
                                                <span>{r}</span>
                                                <button type="button" onClick={() => removeResearch(r)} className="text-[#01010180]"><img src="/icon/cancel.svg" alt="" /></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Qualifications */}
                                <div className="mb-6">
                                    <label className="block text-[14px] text-[#010101] mb-2">Qualifications</label>
                                    <input
                                        value={qualificationInput}
                                        onChange={(e) => setQualificationInput(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addQualification(); } }}
                                        placeholder="Type here"
                                        className="w-full rounded-md border border-[#01010133] mb-[8px] px-3 py-[8px] text-sm placeholder-[#01010180] lg:leading-[24px]  focus:outline-none"
                                    />
                                    <div className="flex gap-2 flex-wrap">
                                        {qualifications.map(q => (
                                            <span key={q} className="inline-flex items-center gap-2 border border-[#0C2141] rounded-full px-3 py-1 lg:py-[4px] text-[14px] text-[#010101CC]">
                                                <span>{q}</span>
                                                <button type="button" onClick={() => removeQualification(q)} className="text-[#01010180]"><img src="/icon/cancel.svg" alt="" /></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Training & Education */}
                                <div className="mb-6">
                                    <label className="block text-[14px] text-[#010101] mb-2">Training & Education</label>
                                    <input
                                        value={trainingInput}
                                        onChange={(e) => setTrainingInput(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTraining(); } }}
                                        placeholder="Type here"
                                        className="w-full rounded-md border border-[#01010133] mb-[8px] px-3 py-[8px] text-sm placeholder-[#01010180] lg:leading-[24px]  focus:outline-none"
                                    />
                                    <div className="flex gap-2 flex-wrap">
                                        {trainings.map(t => (
                                            <span key={t} className="inline-flex items-center gap-2 border border-[#0C2141] rounded-full px-3 py-1 lg:py-[4px] text-[14px] text-[#010101CC]">
                                                <span>{t}</span>
                                                <button type="button" onClick={() => removeTraining(t)} className="text-[#01010180]"><img src="/icon/cancel.svg" alt="" /></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        <div className="mt-6 flex items-center justify-end gap-3">
                            {mode === 'edit' && (
                                <button 
                                    type="button" 
                                    onClick={onClose}
                                    className="px-[50px] py-[12px] rounded-[48px] border border-[#0C2141] text-sm"
                                >
                                    Cancel
                                </button>
                            )}
                            <button 
                                type="submit" 
                                className="px-[40px] py-[12px] rounded-[48px] bg-[#0C2141] text-white text-sm"
                            >
                                {mode === 'create' ? 'Create profile' : 'Update changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
