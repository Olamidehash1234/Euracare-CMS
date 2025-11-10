import React, { useRef, useState } from 'react';

export type ServicePayload = {
  title: string;
  shortDescription?: string;
  image?: string;
  bannerImage?: string;
  publishedAt?: string;
  doctors?: string[];
  conditions?: string[];
  tests?: string[];
  treatments?: string[];
  videoLink?: string;
  overview?: string;
};

interface Props {
  mode?: 'create' | 'edit';
  initialData?: ServicePayload;
  onSave: (data: ServicePayload) => void;
  onClose: () => void;
}

export default function CreateServiceForm({ mode = 'create', initialData, onSave, onClose }: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const bannerFileRef = useRef<HTMLInputElement | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(initialData?.image || null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(initialData?.bannerImage || null);
  const [form, setForm] = useState({
    title: initialData?.title || '',
    shortDescription: initialData?.shortDescription || '',
    overview: initialData?.overview || '',
    videoLink: initialData?.videoLink || '',
  });

  const [conditionInput, setConditionInput] = useState('');
  const [conditions, setConditions] = useState<string[]>([]);

  const [testInput, setTestInput] = useState('');
  const [tests, setTests] = useState<string[]>([]);

  const [treatmentInput, setTreatmentInput] = useState('');
  const [treatments, setTreatments] = useState<string[]>([
  ]);

  const handleFile = (file?: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleBannerFile = (file?: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBannerPreview(url);
  };

  const handleBannerDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleBannerFile(file);
  };

  const handleAddCondition = () => {
    const v = conditionInput.trim();
    if (!v) return;
    if (!conditions.includes(v)) setConditions(prev => [...prev, v]);
    setConditionInput('');
  };
  const handleRemoveCondition = (condition: string) => setConditions(prev => prev.filter(c => c !== condition));

  const handleAddTest = () => {
    const v = testInput.trim();
    if (!v) return;
    if (!tests.includes(v)) setTests(prev => [...prev, v]);
    setTestInput('');
  };
  const handleRemoveTest = (test: string) => setTests(prev => prev.filter(t => t !== test));

  const handleAddTreatment = () => {
    const v = treatmentInput.trim();
    if (!v) return;
    if (!treatments.includes(v)) setTreatments(prev => [...prev, v]);
    setTreatmentInput('');
  };
  const handleRemoveTreatment = (treatment: string) => setTreatments(prev => prev.filter(t => t !== treatment));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      image: coverPreview || undefined,
      bannerImage: bannerPreview || undefined,
      publishedAt: new Date().toISOString(),
      conditions,
      tests,
      treatments,
    });
  };

  return (
    <div className="min-h-screen">
      <div className="">
        <a href="/services" className="inline-flex items-center text-[#0C2141] text-sm lg:text-[16px] font-medium mb-4 gap-[4px]">
          <img src="/icon/right.svg" alt="" /> Back to Services Page
        </a>

        <div className="bg-white rounded-xl border border-[#B9B9B9] overflow-hidden">
          <div className="px-[16px] lg:px-[30px] py-[14px] lg:py-[20px] border-b border-[#0000001A]">
            <h1 className="text-lg lg:text-[20px] text-[#010101] font-medium">
              {mode === 'create' ? 'Add New Services' : 'Edit Service'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-[16px] lg:px-[40px] lg:py-[30px]">
            <div className="border rounded-[10px] border-[#0101011A] p-[16px] lg:p-6">
              <h3 className="text-[16px] font-medium mb-4 lg:mb-[25px]">Service Snippet</h3>

              {/* Grid: inputs + image */}
              <div className="grid grid-cols-1 gap-6">
                {/* Left: form fields */}
                <div className="lg:col-span-2">
                  <div className="mb-[14px] lg:mb-[20px]">
                    <label className="block text-sm text-[#010101] mb-2">Service Name</label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Name of the Service"
                      className="w-full rounded-md border border-[#01010133] lg:leading-[24px] px-3 py-[8px] text-sm focus:outline-none"
                    />
                  </div>

                  <div className='mb-[14px] lg:mb-[20px]'>
                    <label className="block text-sm text-[#010101] mb-2">Service Short Description</label>
                    <textarea
                      value={form.shortDescription}
                      onChange={(e) => setForm(prev => ({ ...prev, shortDescription: e.target.value }))}
                      placeholder="Writeup about the Service"
                      rows={5}
                      className="w-full rounded-md border border-[#01010133] lg:leading-[24px] px-3 py-[8px] text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              {/* cover image upload */}
                <div className="lg:col-span-1">
                  <label className="block text-sm text-[#010101] mb-2">Add Cover Image</label>

                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileRef.current?.click()}
                    className="w-full h-[150px] lg:h-[200px] rounded-md border border-[#01010133] bg-[#F2F2F2] flex items-center justify-center text-center p-4 cursor-pointer"
                  >
                    {coverPreview ? (
                      <img src={coverPreview} alt="cover" className="h-full w-full object-cover" />
                    ) : (
                      <div>
                        <img src="/icon/upload.svg" alt="upload" className="mx-auto mb-2" />
                        <div className="text-sm">
                          Choose Images to <span className="text-green-600">Upload</span> or Drag and drop or <span className="text-green-600">click</span> to browse your image
                        </div>
                        <div className="text-xs text-[#010101CC] mt-1">JPG or PNG Supported format. Max file size is 3mb</div>
                      </div>
                    )}

                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFile(e.target.files?.[0])}
                    />
                  </div>
                </div>
            </div>

            {/* Service Details Section */}
            <div className="mt-8 border rounded-[10px] border-[#0101011A] p-[16px] lg:p-6">
              <h3 className="text-[16px] font-medium mb-4 lg:mb-[25px]">Service Page</h3>

              <div className="lg:col-span-1 mb-[14px] lg:mb-[20px]">
                  <label className="block text-sm text-[#010101] mb-2">Add Banner Image</label>

                  <div
                    onDrop={handleBannerDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => bannerFileRef.current?.click()}
                    className="w-full h-[150px] lg:h-[200px] rounded-md border border-[#01010133] bg-[#F2F2F2] flex items-center justify-center text-center p-4 cursor-pointer"
                  >
                    {bannerPreview ? (
                      <img src={bannerPreview} alt="banner" className="h-full w-full object-cover" />
                    ) : (
                      <div>
                        <img src="/icon/upload.svg" alt="upload" className="mx-auto mb-2" />
                        <div className="text-sm">
                          Choose Images to <span className="text-green-600">Upload</span> or Drag and drop or <span className="text-green-600">click</span> to browse your image
                        </div>
                        <div className="text-xs text-[#010101CC] mt-1">JPG or PNG Supported format. Max file size is 3mb</div>
                      </div>
                    )}

                    <input
                      ref={bannerFileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleBannerFile(e.target.files?.[0])}
                    />
                  </div>
                </div>

              {/* Service Overview */}
              <div className="mb-[14px] lg:mb-[20px]">
                <label className="block text-sm text-[#010101] mb-2">Service Overview</label>
                <textarea
                  value={form.overview}
                  onChange={(e) => setForm(prev => ({ ...prev, overview: e.target.value }))}
                  placeholder="Write a detailed overview of the service"
                  rows={4}
                  className="w-full rounded-md border border-[#01010133] lg:leading-[24px] px-3 py-[8px] text-sm focus:outline-none"
                />
              </div>

              {/* Video Link */}
              <div className="mb-[14px] lg:mb-[20px]">
                <label className="block text-sm text-[#010101] mb-2">Add Video Link</label>
                <input
                  value={form.videoLink}
                  onChange={(e) => setForm(prev => ({ ...prev, videoLink: e.target.value }))}
                  placeholder="Type here"
                  className="w-full rounded-md border border-[#01010133] lg:leading-[24px] px-3 py-[8px] text-sm focus:outline-none"
                />
              </div>

              {/* Doctors
              <div className="mb-[14px] lg:mb-[20px]">
                <label className="block text-sm text-[#010101] mb-2">Doctors</label>
                <div className="flex gap-2">
                  <input
                    value={doctorInput}
                    onChange={(e) => setDoctorInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddDoctor(); } }}
                    placeholder="Add doctors for this service"
                    className="w-full rounded-md border border-[#01010133] px-3 py-[8px] text-sm focus:outline-none"
                  />
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {doctors.map(doctor => (
                    <span key={doctor} className="inline-flex items-center gap-2 border border-[#0C2141] rounded-full px-3 py-1 text-sm">
                      {doctor}
                      <button type="button" onClick={() => handleRemoveDoctor(doctor)} className="text-[#01010180]">
                        <img src="/icon/cancel.svg" alt="" />
                      </button>
                    </span>
                  ))}
                </div>
              </div> */}

              {/* Conditions */}
              <div className="mb-[14px] lg:mb-[20px]">
                <label className="block text-sm text-[#010101] mb-2">Conditions We Treat</label>
                <input
                  value={conditionInput}
                  onChange={(e) => setConditionInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCondition(); } }}
                  placeholder="Add conditions treated"
                  className="w-full rounded-md border border-[#01010133] lg:leading-[24px] px-3 py-[8px] text-sm focus:outline-none"
                />
                <div className="flex gap-2 mt-2 flex-wrap">
                  {conditions.map(condition => (
                    <span key={condition} className="inline-flex items-center gap-2 border border-[#0C2141] rounded-full px-3 py-1 lg:py-[4px] text-[14px] text-[#010101CC]">
                      {condition}
                      <button type="button" onClick={() => handleRemoveCondition(condition)} className="text-[#01010180]">
                        <img src="/icon/cancel.svg" alt="" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Tests & Diagnostics */}
              <div className="mb-[14px] lg:mb-[20px]">
                <label className="block text-sm text-[#010101] mb-2">Test & Diagnostics</label>
                <input
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTest(); } }}
                  placeholder="Add tests and diagnostics"
                  className="w-full rounded-md border border-[#01010133] lg:leading-[24px] px-3 py-[8px] text-sm focus:outline-none"
                />
                <div className="flex gap-2 mt-2 flex-wrap">
                  {tests.map(test => (
                    <span key={test} className="inline-flex items-center gap-2 border border-[#0C2141] rounded-full px-3 py-1 lg:py-[4px] text-[14px] text-[#010101CC]">
                      {test}
                      <button type="button" onClick={() => handleRemoveTest(test)} className="text-[#01010180]">
                        <img src="/icon/cancel.svg" alt="" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Treatment & Procedures */}
              <div className="mb-[14px] lg:mb-[20px]">
                <label className="block text-sm text-[#010101] mb-2">Treatment & Procedures</label>
                <input
                  value={treatmentInput}
                  onChange={(e) => setTreatmentInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTreatment(); } }}
                  placeholder="Add treatments and procedures"
                  className="w-full rounded-md border border-[#01010133] lg:leading-[24px] px-3 py-[8px] text-sm focus:outline-none"
                />
                <div className="flex gap-2 mt-2 flex-wrap">
                  {treatments.map(treatment => (
                    <span key={treatment} className="inline-flex items-center gap-2 border border-[#0C2141] rounded-full px-3 py-1 lg:py-[4px] text-[14px] text-[#010101CC]">
                      {treatment}
                      <button type="button" onClick={() => handleRemoveTreatment(treatment)} className="text-[#01010180]">
                        <img src="/icon/cancel.svg" alt="" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col lg:flex-row justify-end gap-3">
              <button type="button" onClick={onClose} className="px-[50px] py-[12px] rounded-[48px] border border-[#0C2141] text-sm">
                Cancel
              </button>
              <button type="submit" className="px-[40px] py-[12px] rounded-[48px] bg-[#0C2141] text-white text-sm">
                {mode === 'create' ? 'Create Service' : 'Update changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
