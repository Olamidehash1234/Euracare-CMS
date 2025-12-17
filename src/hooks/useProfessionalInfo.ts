import { useState } from 'react';

export const useProfessionalInfo = (initialData?: any) => {
  const [programInput, setProgramInput] = useState<string>('');
  const [programs, setPrograms] = useState<string[]>(initialData?.programs || []);

  const [researchInput, setResearchInput] = useState<string>('');
  const [researchInterests, setResearchInterests] = useState<string[]>(initialData?.researchInterests || []);

  const [qualificationInput, setQualificationInput] = useState<string>('');
  const [qualifications, setQualifications] = useState<string[]>(initialData?.qualifications || []);

  const [trainingInput, setTrainingInput] = useState<string>('');
  const [trainings, setTrainings] = useState<string[]>(initialData?.trainings || []);

  const [associationInput, setAssociationInput] = useState<string>('');
  const [associations, setAssociations] = useState<string[]>(
    initialData?.associations ? (Array.isArray(initialData.associations) ? initialData.associations : []) : []
  );

  const [certificationInput, setCertificationInput] = useState<string>('');
  const [certifications, setCertifications] = useState<string[]>(initialData?.certifications || []);

  // Program handlers
  const addProgram = (): void => {
    const v = programInput.trim();
    if (!v) return;
    if (!programs.includes(v)) setPrograms(prev => [...prev, v]);
    setProgramInput('');
  };
  const removeProgram = (p: string): void => setPrograms(prev => prev.filter(x => x !== p));

  // Research handlers
  const addResearch = (): void => {
    const v = researchInput.trim();
    if (!v) return;
    if (!researchInterests.includes(v)) setResearchInterests(prev => [...prev, v]);
    setResearchInput('');
  };
  const removeResearch = (r: string): void => setResearchInterests(prev => prev.filter(x => x !== r));

  // Qualification handlers
  const addQualification = (): void => {
    const v = qualificationInput.trim();
    if (!v) return;
    if (!qualifications.includes(v)) setQualifications(prev => [...prev, v]);
    setQualificationInput('');
  };
  const removeQualification = (q: string): void => setQualifications(prev => prev.filter(x => x !== q));

  // Training handlers
  const addTraining = (): void => {
    const v = trainingInput.trim();
    if (!v) return;
    if (!trainings.includes(v)) setTrainings(prev => [...prev, v]);
    setTrainingInput('');
  };
  const removeTraining = (t: string): void => setTrainings(prev => prev.filter(x => x !== t));

  // Association handlers
  const addAssociation = (): void => {
    const v = associationInput.trim();
    if (!v) return;
    if (!associations.includes(v)) setAssociations(prev => [...prev, v]);
    setAssociationInput('');
  };
  const removeAssociation = (a: string): void => setAssociations(prev => prev.filter(x => x !== a));

  // Certification handlers
  const addCertification = (): void => {
    const v = certificationInput.trim();
    if (!v) return;
    if (!certifications.includes(v)) setCertifications(prev => [...prev, v]);
    setCertificationInput('');
  };
  const removeCertification = (c: string): void => setCertifications(prev => prev.filter(x => x !== c));

  const resetProfessionalInfo = (): void => {
    setProgramInput('');
    setPrograms([]);
    setResearchInput('');
    setResearchInterests([]);
    setQualificationInput('');
    setQualifications([]);
    setTrainingInput('');
    setTrainings([]);
    setAssociationInput('');
    setAssociations([]);
    setCertificationInput('');
    setCertifications([]);
  };

  return {
    programInput,
    setProgramInput,
    programs,
    addProgram,
    removeProgram,

    researchInput,
    setResearchInput,
    researchInterests,
    addResearch,
    removeResearch,

    qualificationInput,
    setQualificationInput,
    qualifications,
    addQualification,
    removeQualification,

    trainingInput,
    setTrainingInput,
    trainings,
    addTraining,
    removeTraining,

    associationInput,
    setAssociationInput,
    associations,
    addAssociation,
    removeAssociation,

    certificationInput,
    setCertificationInput,
    certifications,
    addCertification,
    removeCertification,
    resetProfessionalInfo,
  };
};
