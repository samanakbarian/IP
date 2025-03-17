import { 
  University, 
  ProgramStatistics, 
  UniversityStatistics, 
  GeographicDistribution, 
  GenderDistribution,
  Region,
  StatisticsFilter
} from '../models/types';
import * as uhrService from './uhrService';
import * as scbService from './scbService';

// Mockdata för fallback
import { 
  mockUniversities, 
  mockRegions, 
  mockStatistics, 
  mockGeographicDistributions, 
  mockGenderDistributions 
} from '../utils/mockData';

/**
 * Hämta alla lärosäten
 */
export const getUniversities = async (): Promise<University[]> => {
  try {
    // Försök hämta från UHR först
    return await uhrService.fetchUniversities();
  } catch (error) {
    console.warn('Kunde inte hämta lärosäten från UHR, använder mockdata istället', error);
    // Fallback till mockdata
    return mockUniversities;
  }
};

/**
 * Hämta alla regioner
 */
export const getRegions = async (): Promise<Region[]> => {
  try {
    // Försök hämta från SCB först
    return await scbService.fetchRegions();
  } catch (error) {
    console.warn('Kunde inte hämta regioner från SCB, använder mockdata istället', error);
    // Fallback till mockdata
    return mockRegions;
  }
};

/**
 * Hämta statistik baserat på filter
 */
export const getStatistics = async (filter: StatisticsFilter): Promise<ProgramStatistics[]> => {
  try {
    // Här skulle vi implementera logik för att hämta data från UHR och SCB
    // och kombinera den till ett enhetligt format
    
    // För enkelhetens skull använder vi mockdata i detta exempel
    throw new Error('API-anrop inte implementerat ännu');
  } catch (error) {
    console.warn('Kunde inte hämta statistik från API, använder mockdata istället', error);
    
    // Fallback till mockdata
    let filteredStats = [...mockStatistics];
    
    if (filter.universityId) {
      filteredStats = filteredStats.filter(stat => stat.universityId === filter.universityId);
    }
    
    if (filter.fromYear) {
      filteredStats = filteredStats.filter(stat => stat.year >= filter.fromYear!);
    }
    
    if (filter.toYear) {
      filteredStats = filteredStats.filter(stat => stat.year <= filter.toYear!);
    }
    
    if (filter.programId) {
      filteredStats = filteredStats.filter(stat => stat.id.startsWith(filter.programId!));
    }
    
    return filteredStats;
  }
};

/**
 * Hämta aggregerad statistik för ett lärosäte
 */
export const getUniversityStatistics = async (universityId: string): Promise<UniversityStatistics[]> => {
  try {
    // Här skulle vi implementera logik för att hämta data från UHR och SCB
    // och kombinera den till ett enhetligt format
    
    // För enkelhetens skull använder vi mockdata i detta exempel
    throw new Error('API-anrop inte implementerat ännu');
  } catch (error) {
    console.warn('Kunde inte hämta universitetsstatistik från API, använder mockdata istället', error);
    
    // Fallback till mockdata
    const stats = await getStatistics({ universityId });
    
    // Gruppera efter år
    const yearGroups: { [key: number]: ProgramStatistics[] } = {};
    stats.forEach(stat => {
      if (!yearGroups[stat.year]) {
        yearGroups[stat.year] = [];
      }
      yearGroups[stat.year].push(stat);
    });
    
    // Skapa aggregerad statistik per år
    const universityStats: UniversityStatistics[] = Object.keys(yearGroups).map(yearStr => {
      const year = parseInt(yearStr);
      const programs = yearGroups[year];
      
      const totalApplicants = programs.reduce((sum, prog) => sum + prog.applicants, 0);
      const totalAcceptedStudents = programs.reduce((sum, prog) => sum + prog.acceptedStudents, 0);
      
      return {
        universityId,
        year,
        totalApplicants,
        totalAcceptedStudents,
        programs
      };
    });
    
    return universityStats.sort((a, b) => a.year - b.year);
  }
};

/**
 * Hämta geografisk fördelning för ett lärosäte
 */
export const getGeographicDistribution = async (universityId: string, year?: number): Promise<GeographicDistribution[]> => {
  try {
    // Här skulle vi implementera logik för att hämta data från SCB
    // och transformera den till vårt format
    
    // För enkelhetens skull använder vi mockdata i detta exempel
    throw new Error('API-anrop inte implementerat ännu');
  } catch (error) {
    console.warn('Kunde inte hämta geografisk fördelning från API, använder mockdata istället', error);
    
    // Fallback till mockdata
    let filteredDistributions = [...mockGeographicDistributions].filter(
      dist => dist.universityId === universityId
    );
    
    if (year) {
      filteredDistributions = filteredDistributions.filter(dist => dist.year === year);
    }
    
    return filteredDistributions.sort((a, b) => a.year - b.year);
  }
};

/**
 * Hämta könsfördelning för ett lärosäte
 */
export const getGenderDistribution = async (
  universityId: string, 
  year?: number, 
  programId?: string
): Promise<GenderDistribution[]> => {
  try {
    // Här skulle vi implementera logik för att hämta data från UHR och SCB
    // och transformera den till vårt format
    
    // För enkelhetens skull använder vi mockdata i detta exempel
    throw new Error('API-anrop inte implementerat ännu');
  } catch (error) {
    console.warn('Kunde inte hämta könsfördelning från API, använder mockdata istället', error);
    
    // Fallback till mockdata
    let filteredDistributions = [...mockGenderDistributions].filter(
      dist => dist.universityId === universityId
    );
    
    if (year) {
      filteredDistributions = filteredDistributions.filter(dist => dist.year === year);
    }
    
    if (programId) {
      filteredDistributions = filteredDistributions.filter(dist => dist.programId === programId);
    }
    
    return filteredDistributions.sort((a, b) => {
      // Sortera först efter år
      if (a.year !== b.year) return a.year - b.year;
      
      // Sedan sortera så att totalen för lärosätet kommer först
      if (!a.programId && b.programId) return -1;
      if (a.programId && !b.programId) return 1;
      
      // Slutligen sortera program alfabetiskt
      if (a.programName && b.programName) {
        return a.programName.localeCompare(b.programName);
      }
      
      return 0;
    });
  }
}; 