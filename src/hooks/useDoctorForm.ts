import { useState } from 'react';

export type FormState = {
  fullName: string;
  email: string;
  phone: string;
  language: string;
  regNumber: string;
  yearsExperience: string;
  bio: string;
};

export const useDoctorForm = (initialData?: any) => {
  const [form, setForm] = useState<FormState>({
    fullName: initialData?.fullName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    language: initialData?.languages || '',
    regNumber: initialData?.regNumber || '',
    yearsExperience: initialData?.yearsExperience || '',
    bio: initialData?.bio || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return { form, setForm, handleChange };
};
