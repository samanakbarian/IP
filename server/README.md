# Antagningsstatistik API

Detta är en API-server för antagningsstatistik för högskolor och universitet i Sverige.

## Installation

1. Installera beroenden:
   ```bash
   npm install
   ```

2. Skapa en `.env`-fil baserad på `.env.example` och fyll i dina API-nycklar:
   ```bash
   cp .env.example .env
   ```

3. Bygg projektet:
   ```bash
   npm run build
   ```

## Användning

### Utveckling

För att starta servern i utvecklingsläge:

```bash
npm run dev
```

Servern kommer att köras på `http://localhost:3001` som standard.

### Produktion

För att starta servern i produktionsläge:

```bash
npm run build
npm start
```

## API-dokumentation

### Lärosäten

- `GET /api/universities` - Hämta alla lärosäten
- `GET /api/universities/:universityId/statistics` - Hämta aggregerad statistik för ett lärosäte
- `GET /api/universities/:universityId/geographic-distribution` - Hämta geografisk fördelning för ett lärosäte
  - Query-parametrar:
    - `year` (valfri) - Filtrera på år
- `GET /api/universities/:universityId/gender-distribution` - Hämta könsfördelning för ett lärosäte
  - Query-parametrar:
    - `year` (valfri) - Filtrera på år
    - `programId` (valfri) - Filtrera på program

### Statistik

- `GET /api/statistics` - Hämta statistik baserat på filter
  - Query-parametrar:
    - `universityId` (valfri) - Filtrera på lärosäte
    - `fromYear` (valfri) - Filtrera på från-år
    - `toYear` (valfri) - Filtrera på till-år
    - `programId` (valfri) - Filtrera på program

### Regioner

- `GET /api/regions` - Hämta alla regioner

## Datakällor

Servern hämtar data från följande källor:

- UHR (Universitets- och högskolerådet) - Antagningsstatistik
- SCB (Statistiska Centralbyrån) - Befolkningsstatistik och utbildningsstatistik

Om API-anropen misslyckas används simulerad data som fallback.

## Utveckling

### Mappstruktur

- `src/` - Källkod
  - `index.ts` - Huvudingång till applikationen
  - `models/` - Typdefinitioner
  - `routes/` - API-rutter
  - `services/` - Tjänster för att hämta och bearbeta data
  - `utils/` - Hjälpfunktioner och mockdata

### Lägga till nya datakällor

För att lägga till en ny datakälla:

1. Skapa en ny service i `src/services/`
2. Implementera funktioner för att hämta data från källan
3. Uppdatera `dataService.ts` för att använda den nya källan
4. Uppdatera rutterna för att exponera den nya datan 