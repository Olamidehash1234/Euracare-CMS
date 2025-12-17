import React from 'react';
import TagInput from './TagInput';

interface ProfessionalInformationProps {
  programInput: string;
  onProgramInputChange: (value: string) => void;
  programs: string[];
  onAddProgram: () => void;
  onRemoveProgram: (p: string) => void;

  researchInput: string;
  onResearchInputChange: (value: string) => void;
  researchInterests: string[];
  onAddResearch: () => void;
  onRemoveResearch: (r: string) => void;

  qualificationInput: string;
  onQualificationInputChange: (value: string) => void;
  qualifications: string[];
  onAddQualification: () => void;
  onRemoveQualification: (q: string) => void;

  trainingInput: string;
  onTrainingInputChange: (value: string) => void;
  trainings: string[];
  onAddTraining: () => void;
  onRemoveTraining: (t: string) => void;

  associationInput: string;
  onAssociationInputChange: (value: string) => void;
  associations: string[];
  onAddAssociation: () => void;
  onRemoveAssociation: (a: string) => void;

  certificationInput: string;
  onCertificationInputChange: (value: string) => void;
  certifications: string[];
  onAddCertification: () => void;
  onRemoveCertification: (c: string) => void;
}

export default function ProfessionalInformation({
  programInput,
  onProgramInputChange,
  programs,
  onAddProgram,
  onRemoveProgram,

  researchInput,
  onResearchInputChange,
  researchInterests,
  onAddResearch,
  onRemoveResearch,

  qualificationInput,
  onQualificationInputChange,
  qualifications,
  onAddQualification,
  onRemoveQualification,

  trainingInput,
  onTrainingInputChange,
  trainings,
  onAddTraining,
  onRemoveTraining,

  associationInput,
  onAssociationInputChange,
  associations,
  onAddAssociation,
  onRemoveAssociation,

  certificationInput,
  onCertificationInputChange,
  certifications,
  onAddCertification,
  onRemoveCertification,
}: ProfessionalInformationProps): React.ReactElement {
  const handleKeyPress =
    (onAdd: () => void) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onAdd();
      }
    };

  return (
    <div className="mt-8 border rounded-[10px] border-[#0101011A] p-5 lg:p-[18px]">
      <h3 className="font-medium text-sm lg:text-[16px] mb-4">Professional Information</h3>

      <TagInput
        label="Programs & Specialties"
        value={programInput}
        onChange={onProgramInputChange}
        onKeyDown={handleKeyPress(onAddProgram)}
        tags={programs}
        onRemoveTag={onRemoveProgram}
        placeholder="Type here"
      />

      <TagInput
        label="Research Interest"
        value={researchInput}
        onChange={onResearchInputChange}
        onKeyDown={handleKeyPress(onAddResearch)}
        tags={researchInterests}
        onRemoveTag={onRemoveResearch}
        placeholder="Specialties"
      />

      <TagInput
        label="Qualifications"
        value={qualificationInput}
        onChange={onQualificationInputChange}
        onKeyDown={handleKeyPress(onAddQualification)}
        tags={qualifications}
        onRemoveTag={onRemoveQualification}
        placeholder="Type here"
      />

      <TagInput
        label="Training & Education"
        value={trainingInput}
        onChange={onTrainingInputChange}
        onKeyDown={handleKeyPress(onAddTraining)}
        tags={trainings}
        onRemoveTag={onRemoveTraining}
        placeholder="Type here"
      />

      <TagInput
        label="Professional Associations"
        value={associationInput}
        onChange={onAssociationInputChange}
        onKeyDown={handleKeyPress(onAddAssociation)}
        tags={associations}
        onRemoveTag={onRemoveAssociation}
        placeholder="Type association name"
      />

      <TagInput
        label="Certifications"
        value={certificationInput}
        onChange={onCertificationInputChange}
        onKeyDown={handleKeyPress(onAddCertification)}
        tags={certifications}
        onRemoveTag={onRemoveCertification}
        placeholder="Type certification name"
      />
    </div>
  );
}
