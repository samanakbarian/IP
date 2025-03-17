import axios from 'axios';
import dotenv from 'dotenv';
import { Region, SCBApiRequest, SCBApiResponse } from '../models/types';

dotenv.config();

const SCB_API_URL = process.env.SCB_API_URL || 'https://api.scb.se/OV0104/v1/doris/sv/ssd';

// Skapa en Axios-instans med basURL
const scbApi = axios.create({
  baseURL: SCB_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

/**
 * Hämta alla regioner från SCB
 */
export const fetchRegions = async (): Promise<Region[]> => {
  try {
    // OBS: Detta är en exempelfunktion. Den faktiska API-endpointen och datastrukturen kan vara annorlunda.
    // SCB har en komplex API-struktur där man behöver navigera i en hierarki av tabeller
    
    // Exempel på en förfrågan till SCB för att hämta regioner
    const request: SCBApiRequest = {
      query: [
        {
          code: "Region",
          selection: {
            filter: "item",
            values: ["*"]  // Alla regioner
          }
        }
      ],
      response: {
        format: "json"
      }
    };
    
    // Exempel på en endpoint för regiondata
    const response = await scbApi.post<SCBApiResponse>('/BE/BE0101/BE0101A/BefolkningNy', request);
    
    // Transformera SCB:s svar till vårt format
    // Detta är bara ett exempel, den faktiska transformationen beror på SCB:s datastruktur
    const regions: Region[] = response.data.data.map((item: any) => ({
      id: item.key[0].toLowerCase().replace(/\s+/g, '_'),
      name: item.key[0]
    }));
    
    return regions;
  } catch (error) {
    console.error('Fel vid hämtning av regioner från SCB:', error);
    throw new Error('Kunde inte hämta regioner från SCB');
  }
};

/**
 * Hämta befolkningsstatistik per region
 */
export const fetchPopulationByRegion = async (): Promise<any> => {
  try {
    // Exempel på en förfrågan till SCB för att hämta befolkningsstatistik per region
    const request: SCBApiRequest = {
      query: [
        {
          code: "Region",
          selection: {
            filter: "item",
            values: ["*"]  // Alla regioner
          }
        },
        {
          code: "Tid",
          selection: {
            filter: "item",
            values: ["2022"]  // Senaste året
          }
        }
      ],
      response: {
        format: "json"
      }
    };
    
    // Exempel på en endpoint för befolkningsstatistik
    const response = await scbApi.post<SCBApiResponse>('/BE/BE0101/BE0101A/BefolkningNy', request);
    
    // Returnera rådata för vidare bearbetning
    return response.data;
  } catch (error) {
    console.error('Fel vid hämtning av befolkningsstatistik från SCB:', error);
    throw new Error('Kunde inte hämta befolkningsstatistik från SCB');
  }
};

/**
 * Hämta utbildningsstatistik från SCB
 */
export const fetchEducationStatistics = async (year: number): Promise<any> => {
  try {
    // Exempel på en förfrågan till SCB för att hämta utbildningsstatistik
    const request: SCBApiRequest = {
      query: [
        {
          code: "Hogskola",
          selection: {
            filter: "item",
            values: ["*"]  // Alla högskolor
          }
        },
        {
          code: "Tid",
          selection: {
            filter: "item",
            values: [year.toString()]
          }
        }
      ],
      response: {
        format: "json"
      }
    };
    
    // Exempel på en endpoint för utbildningsstatistik
    // OBS: Den faktiska endpointen kan vara annorlunda
    const response = await scbApi.post<SCBApiResponse>('/UF/UF0205/Sokande', request);
    
    // Returnera rådata för vidare bearbetning
    return response.data;
  } catch (error) {
    console.error(`Fel vid hämtning av utbildningsstatistik för år ${year} från SCB:`, error);
    throw new Error(`Kunde inte hämta utbildningsstatistik för år ${year} från SCB`);
  }
}; 