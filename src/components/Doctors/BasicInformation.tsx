import React from 'react';

interface BasicInformationProps {
  fullName: string;
  email: string;
  phone: string;
  language: string;
  regNumber: string;
  yearsExperience: string;
  bio: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function BasicInformation({
  fullName,
  email,
  phone,
  language,
  regNumber,
  yearsExperience,
  bio,
  onChange,
}: BasicInformationProps): React.ReactElement {
  return (
    <div className="border rounded-[10px] border-[#0101011A] p-5 lg:p-[18px]">
      <h2 className="font-medium text-sm lg:text-[16px] lg:mb-[30px] mb-4">Basic Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-[30px] gap-y-4">
        {/* Full name */}
        <div>
          <label className="block text-[14px] text-[#010101] mb-2">Full Name</label>
          <input
            name="fullName"
            value={fullName}
            onChange={onChange}
            className="w-full rounded-[6px] border border-[#01010133] px-3 py-[8px] text-sm placeholder-[#01010180] lg:leading-[24px]  focus:outline-none"
            placeholder="Shai Hulud"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-[14px] text-[#010101] mb-2">Email Address</label>
          <input
            name="email"
            value={email}
            onChange={onChange}
            type="email"
            className="w-full rounded-md border border-[#01010133] px-3 py-[8px] text-sm placeholder-[#01010180] lg:leading-[24px]  focus:outline-none"
            placeholder="shaihuld@gmail.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-[14px] text-[#010101] mb-2">Phone Number</label>
          <input
            name="phone"
            value={phone}
            onChange={onChange}
            className="w-full rounded-md border border-[#01010133] px-3 py-[8px] text-sm placeholder-[#01010180] lg:leading-[24px]  focus:outline-none"
            placeholder="701 234 5678"
          />
        </div>

        {/* Language */}
        <div className="md:col-span-1 lg:col-span-1">
          <label className="block text-[14px] text-[#010101] mb-2">Language</label>
          <input
            name="language"
            value={language}
            onChange={onChange}
            placeholder="e.g., English"
            className="w-full rounded-md border border-[#01010133] px-3 py-[8px] text-sm placeholder-[#01010180] lg:leading-[24px]  focus:outline-none"
          />
        </div>

        {/* Reg Number */}
        <div>
          <label className="block text-[14px] text-[#010101] mb-2">Reg Number</label>
          <input
            name="regNumber"
            value={regNumber}
            onChange={onChange}
            className="w-full rounded-md border border-[#01010133] px-3 py-[8px] text-sm placeholder-[#01010180] lg:leading-[24px]  focus:outline-none"
            placeholder="RC3456KSV"
          />
        </div>

        {/* Years Experience */}
        <div>
          <label className="block text-[14px] text-[#010101] mb-2">Years of Experience</label>
          <input
            name="yearsExperience"
            value={yearsExperience}
            onChange={onChange}
            className="w-full rounded-md border border-[#01010133] px-3 py-[8px] text-sm placeholder-[#01010180] lg:leading-[24px]  focus:outline-none"
            placeholder="20 years"
          />
        </div>
      </div>

      {/* Doctor's Bio */}
      <div className="mt-5">
        <label className="block text-[14px] text-[#010101] mb-2">Doctor's Bio</label>
        <textarea
          name="bio"
          value={bio}
          onChange={onChange}
          rows={6}
          placeholder="Writeup about the Doctor"
          className="w-full rounded-md border border-[#01010133] px-3 py-[8px] text-sm placeholder-[#01010180] lg:leading-[24px]  focus:outline-none"
        />
      </div>
    </div>
  );
}
