import axios from 'axios';
import dotenv from 'dotenv';
import { University, ProgramStatistics, UHRApiResponse } from '../models/types';

dotenv.config();

const UHR_API_URL = process.env.UHR_API_URL || 'https://api.uhr.se/antagning';
const UHR_API_KEY = process.env.UHR_API_KEY;

// Skapa en Axios-instans med basURL och headers
const uhrApi = axios.create({
  baseURL: UHR_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': UHR_API_KEY ? `Bearer ${UHR_API_KEY}` : ''
  }
});

/**
 * Hämta alla lärosäten från UHR
 */
export const fetchUniversities = async (): Promise<University[]> => {
  try {
    // OBS: Detta är en exempelfunktion. Den faktiska API-endpointen kan vara annorlunda.
    const response = await uhrApi.get<UHRApiResponse<University[]>>('/universities');
    return response.data.data;
  } catch (error) {
    console.error('Fel vid hämtning av lärosäten från UHR:', error);
    throw new Error('Kunde inte hämta lärosäten från UHR');
  }
};

/**
 * Hämta program för ett specifikt lärosäte
 */
export const fetchPrograms = async (universityId: string): Promise<ProgramStatistics[]> => {
  try {
    // OBS: Detta är en exempelfunktion. Den faktiska API-endpointen kan vara annorlunda.
    const response = await uhrApi.get<UHRApiResponse<ProgramStatistics[]>>(`/universities/${universityId}/programs`);
    return response.data.data;
  } catch (error) {
    console.error(`Fel vid hämtning av program för lärosäte ${universityId} från UHR:`, error);
    throw new Error(`Kunde inte hämta program för lärosäte ${universityId} från UHR`);
  }
};

/**
 * Hämta statistik för ett specifikt program
 */
export const fetchProgramStatistics = async (
  universityId: string,
  programId: string,
  year?: number
): Promise<ProgramStatistics[]> => {
  try {
    // OBS: Detta är en exempelfunktion. Den faktiska API-endpointen kan vara annorlunda.
    const params = year ? { year } : {};
    const response = await uhrApi.get<UHRApiResponse<ProgramStatistics[]>>(
      `/universities/${universityId}/programs/${programId}/statistics`,
      { params }
    );
    return response.data.data;
  } catch (error) {
    console.error(`Fel vid hämtning av statistik för program ${programId} från UHR:`, error);
    throw new Error(`Kunde inte hämta statistik för program ${programId} från UHR`);
  }
}; 