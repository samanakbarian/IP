// Typdefinitioner för antagningsstatistik

// Lärosäte
export interface University {
  id: string;
  name: string;
}

// Statistik för ett program
export interface ProgramStatistics {
  id: string;
  name: string;
  universityId: string;
  year: number;
  applicants: number;
  acceptedStudents: number;
  firstHandApplicants: number;
}

// Geografisk region
export interface Region {
  id: string;
  name: string;
}

// Geografisk fördelning av sökande
export interface GeographicDistribution {
  universityId: string;
  year: number;
  regionData: RegionData[];
}

// Data för en specifik region
export interface RegionData {
  regionId: string;
  regionName: string;
  applicantCount: number;
  percentage: number;
}

// Könsfördelning bland sökande
export interface GenderDistribution {
  universityId: string;
  year: number;
  programId?: string;
  programName?: string;
  maleApplicants: number;
  femaleApplicants: number;
  otherApplicants: number;
  maleAccepted: number;
  femaleAccepted: number;
  otherAccepted: number;
}

// Statistik för ett lärosäte
export interface UniversityStatistics {
  universityId: string;
  year: number;
  totalApplicants: number;
  totalAcceptedStudents: number;
  programs: ProgramStatistics[];
}

// Filter för statistiksökning
export interface StatisticsFilter {
  universityId?: string;
  fromYear?: number;
  toYear?: number;
  programId?: string;
} 