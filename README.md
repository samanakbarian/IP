# Antagningsstatistik

En applikation för att analysera antagningsstatistik för högskolor och universitet i Sverige.

## Projektstruktur

Projektet består av två delar:

1. **Frontend** - En React-applikation som visar antagningsstatistik
2. **Backend** - En Express-server som hämtar data från olika källor

## Installation

### Frontend

1. Installera beroenden:
   ```bash
   npm install
   ```

2. Skapa en `.env`-fil med API-URL:
   ```bash
   echo "REACT_APP_API_BASE_URL=http://localhost:3001/api" > .env
   ```

3. Starta utvecklingsservern:
   ```bash
   npm start
   ```

### Backend

1. Gå till server-mappen:
   ```bash
   cd server
   ```

2. Installera beroenden:
   ```bash
   npm install
   ```

3. Skapa en `.env`-fil baserad på `.env.example` och fyll i dina API-nycklar:
   ```bash
   cp .env.example .env
   ```

4. Starta utvecklingsservern:
   ```bash
   npm run dev
   ```

## Datakällor

Applikationen hämtar data från följande källor:

- **UHR (Universitets- och högskolerådet)** - Antagningsstatistik
- **SCB (Statistiska Centralbyrån)** - Befolkningsstatistik och utbildningsstatistik

Om API-anropen misslyckas används simulerad data som fallback.

## Funktioner

- Visa antagningsstatistik för olika lärosäten
- Visa trender över tid
- Visa geografisk fördelning av sökande
- Visa könsfördelning bland sökande och antagna

## Utveckling

### Lägga till nya datakällor

För att lägga till en ny datakälla:

1. Skapa en ny service i `server/src/services/`
2. Implementera funktioner för att hämta data från källan
3. Uppdatera `dataService.ts` för att använda den nya källan
4. Uppdatera rutterna för att exponera den nya datan

### Lägga till nya visualiseringar

För att lägga till en ny visualisering:

1. Skapa en ny komponent i `src/components/`
2. Implementera funktioner för att hämta data från API:et
3. Skapa visualiseringen med hjälp av Chart.js eller annan lämplig bibliotek
4. Lägg till komponenten i `App.tsx`

## Teknologier

- React
- TypeScript
- Chart.js för datavisualisering
- CSS för styling

## Installation och körning

1. Klona projektet
2. Installera beroenden med `npm install`
3. Starta utvecklingsservern med `npm start`
4. Öppna [http://localhost:3000](http://localhost:3000) i din webbläsare

## Utveckling

Projektet är strukturerat enligt följande:

- `src/components`: React-komponenter
- `src/models`: Datamodeller och typdefinitioner
- `src/services`: Tjänster för datahämtning
- `src/utils`: Hjälpfunktioner
- `src/assets`: Bilder och andra tillgångar

## Framtida förbättringar

- Lägga till fler filtreringsalternativ
- Implementera jämförelse mellan olika lärosäten
- Lägga till detaljerad statistik för specifika program
- Integrera med en riktig API för antagningsstatistik

## Licens

Detta projekt är licensierat under MIT-licensen. 