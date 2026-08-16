export interface JobPostingFormState {
  jobTitle: string;
  companyName: string;
  city: string;
  contractType: string;
  salary: string;
  workSchedule: string;
  vacancyCount: string;
  requirementsText: string;
  applicationInstructions: string;
  storyFooterText: string;
}

export interface JobPostingRequest {
  jobTitle: string;
  companyName?: string;
  city?: string;
  contractType?: string;
  salary?: string;
  workSchedule?: string;
  vacancyCount?: number;
  requirements?: string[];
  applicationInstructions?: string;
  storyFooterText?: string;
}

export interface GeneratedPost {
  feedImageBase64: string;
  storyImageBase64: string;
  caption: string;
}

export type PostPreviewFormat = 'feed' | 'story';
