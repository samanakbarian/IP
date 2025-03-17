import axios from 'axios';
import { University, ProgramStatistics, UniversityStatistics, StatisticsFilter, GeographicDistribution, RegionData, Region, GenderDistribution } from '../models/types';

// API-basURL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

// Simulerad data för demonstration och fallback
const mockUniversities: University[] = [
  { id: 'kth', name: 'Kungliga Tekniska Högskolan' },
  { id: 'su', name: 'Stockholms Universitet' },
  { id: 'uu', name: 'Uppsala Universitet' },
  { id: 'lu', name: 'Lunds Universitet' },
  { id: 'gu', name: 'Göteborgs Universitet' },
];

// Svenska regioner
const mockRegions: Region[] = [
  { id: 'stockholm', name: 'Stockholm' },
  { id: 'uppsala', name: 'Uppsala' },
  { id: 'skane', name: 'Skåne' },
  { id: 'vastra_gotaland', name: 'Västra Götaland' },
  { id: 'ostergotland', name: 'Östergötland' },
  { id: 'norrbotten', name: 'Norrbotten' },
  { id: 'vasterbotten', name: 'Västerbotten' },
  { id: 'jamtland', name: 'Jämtland' },
  { id: 'dalarna', name: 'Dalarna' },
  { id: 'orebro', name: 'Örebro' },
  { id: 'vastmanland', name: 'Västmanland' },
  { id: 'sodermanland', name: 'Södermanland' },
  { id: 'gavleborg', name: 'Gävleborg' },
  { id: 'varmland', name: 'Värmland' },
  { id: 'jonkoping', name: 'Jönköping' },
  { id: 'kalmar', name: 'Kalmar' },
  { id: 'kronoberg', name: 'Kronoberg' },
  { id: 'blekinge', name: 'Blekinge' },
  { id: 'halland', name: 'Halland' },
  { id: 'gotland', name: 'Gotland' },
  { id: 'vasternorrland', name: 'Västernorrland' },
];

// Program med typisk könsfördelning
const programGenderBias: { [key: string]: { male: number, female: number, other: number } } = {
  'cs': { male: 0.75, female: 0.23, other: 0.02 },  // Datavetenskap - mansdominerad
  'eng': { male: 0.65, female: 0.33, other: 0.02 }, // Civilingenjör - mansdominerad
  'med': { male: 0.35, female: 0.63, other: 0.02 }, // Läkarprogrammet - kvinnodominerad
};

// Generera simulerad statistik för demonstration
const generateMockStatistics = (): ProgramStatistics[] => {
  const statistics: ProgramStatistics[] = [];
  
  mockUniversities.forEach(university => {
    const programs = [
      { id: `${university.id}-cs`, name: 'Datavetenskap' },
      { id: `${university.id}-eng`, name: 'Civilingenjör' },
      { id: `${university.id}-med`, name: 'Läkarprogrammet' },
    ];
    
    programs.forEach(program => {
      for (let year = 2010; year <= 2023; year++) {
        // Simulera en trend med ökande antal sökande
        const baseApplicants = 500 + Math.floor(Math.random() * 500);
        const yearFactor = (year - 2010) * 50;
        const randomFactor = Math.floor(Math.random() * 200) - 100;
        
        const applicants = baseApplicants + yearFactor + randomFactor;
        const acceptedStudents = Math.floor(applicants * (0.1 + Math.random() * 0.2));
        const firstHandApplicants = Math.floor(applicants * (0.4 + Math.random() * 0.3));
        
        statistics.push({
          id: `${program.id}-${year}`,
          name: program.name,
          universityId: university.id,
          year,
          applicants,
          acceptedStudents,
          firstHandApplicants
        });
      }
    });
  });
  
  return statistics;
};

// Generera simulerad geografisk fördelning
const generateMockGeographicDistribution = (): GeographicDistribution[] => {
  const distributions: GeographicDistribution[] = [];
  
  mockUniversities.forEach(university => {
    for (let year = 2010; year <= 2023; year++) {
      // Skapa en fördelning baserad på lärosätets geografiska läge
      // Högre procent från närliggande regioner
      const regionData: RegionData[] = [];
      let totalPercentage = 0;
      
      // Bestäm vilka regioner som är "nära" lärosätet
      const nearbyRegions: string[] = [];
      switch (university.id) {
        case 'kth':
        case 'su':
          nearbyRegions.push('stockholm', 'uppsala', 'sodermanland');
          break;
        case 'uu':
          nearbyRegions.push('uppsala', 'stockholm', 'vastmanland');
          break;
        case 'lu':
          nearbyRegions.push('skane', 'blekinge', 'halland');
          break;
        case 'gu':
          nearbyRegions.push('vastra_gotaland', 'halland', 'varmland');
          break;
      }
      
      // Fördela sökande över regioner
      mockRegions.forEach(region => {
        let percentage: number;
        
        if (nearbyRegions.includes(region.id)) {
          // Högre procent från närliggande regioner (10-25%)
          percentage = 10 + Math.random() * 15;
        } else {
          // Lägre procent från andra regioner (1-5%)
          percentage = 1 + Math.random() * 4;
        }
        
        // Justera för att säkerställa att summan blir 100%
        totalPercentage += percentage;
        
        // Simulera antalet sökande baserat på procent
        // Anta att vi har totalt 1000-3000 sökande per år
        const totalApplicants = 1000 + Math.floor(Math.random() * 2000);
        const applicantCount = Math.floor((percentage / 100) * totalApplicants);
        
        regionData.push({
          regionId: region.id,
          regionName: region.name,
          applicantCount,
          percentage
        });
      });
      
      // Normalisera procentandelarna så att summan blir 100%
      regionData.forEach(data => {
        data.percentage = (data.percentage / totalPercentage) * 100;
      });
      
      // Sortera efter antal sökande (fallande)
      regionData.sort((a, b) => b.applicantCount - a.applicantCount);
      
      distributions.push({
        universityId: university.id,
        year,
        regionData
      });
    }
  });
  
  return distributions;
};

// Generera simulerad könsfördelning
const generateMockGenderDistribution = (): GenderDistribution[] => {
  const distributions: GenderDistribution[] = [];
  
  // För varje lärosäte
  mockUniversities.forEach(university => {
    // För varje år
    for (let year = 2010; year <= 2023; year++) {
      // För varje program
      const programs = [
        { id: `${university.id}-cs`, name: 'Datavetenskap', type: 'cs' },
        { id: `${university.id}-eng`, name: 'Civilingenjör', type: 'eng' },
        { id: `${university.id}-med`, name: 'Läkarprogrammet', type: 'med' },
      ];
      
      // Lägg till en total för hela lärosätet
      const totalApplicants = 1500 + Math.floor(Math.random() * 1000) + (year - 2010) * 100;
      const totalAccepted = Math.floor(totalApplicants * (0.2 + Math.random() * 0.1));
      
      // Beräkna genomsnittlig könsfördelning för lärosätet
      // Anta en gradvis förändring mot jämnare könsfördelning över tid
      const yearFactor = (year - 2010) * 0.005; // Små förändringar per år
      
      // Genomsnittlig könsfördelning för lärosätet
      let maleBias = 0.55 - yearFactor; // Startar med 55% män, minskar något över tid
      let femaleBias = 0.43 + yearFactor; // Startar med 43% kvinnor, ökar något över tid
      const otherBias = 0.02; // Konstant 2% övriga
      
      // Justera för att säkerställa att summan blir 100%
      const totalBias = maleBias + femaleBias + otherBias;
      maleBias = maleBias / totalBias;
      femaleBias = femaleBias / totalBias;
      
      // Lägg till total för lärosätet
      distributions.push({
        universityId: university.id,
        year,
        maleApplicants: Math.floor(totalApplicants * maleBias),
        femaleApplicants: Math.floor(totalApplicants * femaleBias),
        otherApplicants: Math.floor(totalApplicants * otherBias),
        maleAccepted: Math.floor(totalAccepted * maleBias),
        femaleAccepted: Math.floor(totalAccepted * femaleBias),
        otherAccepted: Math.floor(totalAccepted * otherBias)
      });
      
      // Lägg till för varje program
      programs.forEach(program => {
        const programApplicants = 400 + Math.floor(Math.random() * 300) + (year - 2010) * 30;
        const programAccepted = Math.floor(programApplicants * (0.15 + Math.random() * 0.15));
        
        // Hämta programmets typiska könsfördelning
        const genderBias = programGenderBias[program.type];
        
        // Justera för förändringar över tid (gradvis jämnare fördelning)
        let maleRatio = genderBias.male - yearFactor * (genderBias.male > 0.5 ? 1 : -1);
        let femaleRatio = genderBias.female + yearFactor * (genderBias.female < 0.5 ? 1 : -1);
        const otherRatio = genderBias.other;
        
        // Normalisera för att säkerställa att summan blir 100%
        const totalRatio = maleRatio + femaleRatio + otherRatio;
        maleRatio = maleRatio / totalRatio;
        femaleRatio = femaleRatio / totalRatio;
        
        distributions.push({
          universityId: university.id,
          year,
          programId: program.id,
          programName: program.name,
          maleApplicants: Math.floor(programApplicants * maleRatio),
          femaleApplicants: Math.floor(programApplicants * femaleRatio),
          otherApplicants: Math.floor(programApplicants * otherRatio),
          maleAccepted: Math.floor(programAccepted * maleRatio),
          femaleAccepted: Math.floor(programAccepted * femaleRatio),
          otherAccepted: Math.floor(programAccepted * otherRatio)
        });
      });
    }
  });
  
  return distributions;
};

const mockStatistics = generateMockStatistics();
const mockGeographicDistributions = generateMockGeographicDistribution();
const mockGenderDistributions = generateMockGenderDistribution();

// Hämta alla lärosäten
export const getUniversities = async (): Promise<University[]> => {
  try {
    // Försök hämta från API först
    const response = await axios.get<University[]>(`${API_BASE_URL}/universities`);
    return response.data;
  } catch (error) {
    console.warn('Kunde inte hämta lärosäten från API, använder mockdata istället', error);
    // Fallback till mockdata om API-anropet misslyckas
    return Promise.resolve(mockUniversities);
  }
};

// Hämta alla regioner
export const getRegions = async (): Promise<Region[]> => {
  try {
    const response = await axios.get<Region[]>(`${API_BASE_URL}/regions`);
    return response.data;
  } catch (error) {
    console.warn('Kunde inte hämta regioner från API, använder mockdata istället', error);
    return Promise.resolve(mockRegions);
  }
};

// Hämta statistik baserat på filter
export const getStatistics = async (filter: StatisticsFilter): Promise<ProgramStatistics[]> => {
  try {
    const response = await axios.get<ProgramStatistics[]>(`${API_BASE_URL}/statistics`, { 
      params: filter 
    });
    return response.data;
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
    
    return Promise.resolve(filteredStats);
  }
};

// Hämta aggregerad statistik för ett lärosäte
export const getUniversityStatistics = async (universityId: string): Promise<UniversityStatistics[]> => {
  try {
    const response = await axios.get<UniversityStatistics[]>(`${API_BASE_URL}/universities/${universityId}/statistics`);
    return response.data;
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

// Hämta geografisk fördelning för ett lärosäte
export const getGeographicDistribution = async (universityId: string, year?: number): Promise<GeographicDistribution[]> => {
  try {
    const params = year ? { year } : {};
    const response = await axios.get<GeographicDistribution[]>(
      `${API_BASE_URL}/universities/${universityId}/geographic-distribution`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.warn('Kunde inte hämta geografisk fördelning från API, använder mockdata istället', error);
    
    // Fallback till mockdata
    let filteredDistributions = [...mockGeographicDistributions].filter(
      dist => dist.universityId === universityId
    );
    
    if (year) {
      filteredDistributions = filteredDistributions.filter(dist => dist.year === year);
    }
    
    return Promise.resolve(filteredDistributions.sort((a, b) => a.year - b.year));
  }
};

// Hämta könsfördelning för ett lärosäte
export const getGenderDistribution = async (
  universityId: string, 
  year?: number, 
  programId?: string
): Promise<GenderDistribution[]> => {
  try {
    const params = { year, programId };
    const response = await axios.get<GenderDistribution[]>(
      `${API_BASE_URL}/universities/${universityId}/gender-distribution`,
      { params }
    );
    return response.data;
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
    
    return Promise.resolve(filteredDistributions.sort((a, b) => {
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
    }));
  }
}; 