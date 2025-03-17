import React, { useState } from 'react';
import './App.css';
import UniversitySelector from './components/UniversitySelector';
import StatisticsDisplay from './components/StatisticsDisplay';
import GeographicDistributionDisplay from './components/GeographicDistributionDisplay';
import GenderDistributionDisplay from './components/GenderDistributionDisplay';

function App() {
  const [selectedUniversity, setSelectedUniversity] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);

  const handleSelectUniversity = (universityId: string) => {
    setSelectedUniversity(universityId);
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Antagningsstatistik för högskolor och universitet</h1>
      </header>
      <main className="App-main">
        <div className="container">
          <div className="sidebar">
            <UniversitySelector onSelectUniversity={handleSelectUniversity} />
          </div>
          <div className="content">
            <StatisticsDisplay 
              universityId={selectedUniversity} 
              onYearChange={handleYearChange}
            />
            
            {selectedUniversity && selectedYear && (
              <>
                <div className="gender-section">
                  <GenderDistributionDisplay 
                    universityId={selectedUniversity}
                    selectedYear={selectedYear}
                  />
                </div>
                
                <div className="geographic-section">
                  <GeographicDistributionDisplay 
                    universityId={selectedUniversity}
                    selectedYear={selectedYear}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <footer className="App-footer">
        <p>© 2023 Antagningsstatistik</p>
      </footer>
    </div>
  );
}

export default App; 