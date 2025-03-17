import React, { useEffect, useState } from 'react';
import { GenderDistribution } from '../models/types';
import { getGenderDistribution } from '../services/statisticsService';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Registrera Chart.js-komponenter
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

interface GenderDistributionDisplayProps {
  universityId: string;
  selectedYear?: number;
}

const GenderDistributionDisplay: React.FC<GenderDistributionDisplayProps> = ({ 
  universityId, 
  selectedYear 
}) => {
  const [distributions, setDistributions] = useState<GenderDistribution[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'applicants' | 'accepted'>('applicants');

  useEffect(() => {
    const fetchDistributions = async () => {
      if (!universityId) {
        setDistributions([]);
        return;
      }

      try {
        setLoading(true);
        const data = await getGenderDistribution(universityId, selectedYear);
        setDistributions(data);
        setSelectedProgram(null);
        setLoading(false);
      } catch (err) {
        setError('Kunde inte hämta könsfördelning. Försök igen senare.');
        setLoading(false);
      }
    };

    fetchDistributions();
  }, [universityId, selectedYear]);

  const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const programId = e.target.value;
    setSelectedProgram(programId || null);
  };

  const handleViewModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setViewMode(e.target.value as 'applicants' | 'accepted');
  };

  if (!universityId) {
    return <div className="no-selection">Välj ett lärosäte för att se könsfördelning</div>;
  }

  if (loading) {
    return <div>Laddar könsfördelning...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (distributions.length === 0) {
    return <div>Ingen könsfördelning tillgänglig för detta lärosäte</div>;
  }

  // Hitta den valda distributionen (total eller för ett specifikt program)
  const selectedDistribution = selectedProgram
    ? distributions.find(d => d.programId === selectedProgram && d.year === selectedYear)
    : distributions.find(d => !d.programId && d.year === selectedYear);

  if (!selectedDistribution) {
    return <div>Ingen data tillgänglig för valt år och program</div>;
  }

  // Förbereda data för cirkeldiagram
  const pieData = {
    labels: ['Män', 'Kvinnor', 'Övriga'],
    datasets: [
      {
        data: viewMode === 'applicants' 
          ? [
              selectedDistribution.maleApplicants,
              selectedDistribution.femaleApplicants,
              selectedDistribution.otherApplicants
            ]
          : [
              selectedDistribution.maleAccepted,
              selectedDistribution.femaleAccepted,
              selectedDistribution.otherAccepted
            ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(75, 192, 192, 0.7)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: `Könsfördelning - ${viewMode === 'applicants' ? 'Sökande' : 'Antagna'} (${selectedYear})`,
        font: {
          size: 16
        }
      },
    },
  };

  // Förbereda data för stapeldiagram (trender över tid)
  const programDistributions = distributions
    .filter(d => d.programId === selectedProgram || (!selectedProgram && !d.programId))
    .sort((a, b) => a.year - b.year);

  const years = programDistributions.map(d => d.year.toString());
  
  const maleData = viewMode === 'applicants' 
    ? programDistributions.map(d => d.maleApplicants)
    : programDistributions.map(d => d.maleAccepted);
  
  const femaleData = viewMode === 'applicants'
    ? programDistributions.map(d => d.femaleApplicants)
    : programDistributions.map(d => d.femaleAccepted);
  
  const otherData = viewMode === 'applicants'
    ? programDistributions.map(d => d.otherApplicants)
    : programDistributions.map(d => d.otherAccepted);

  // Beräkna procentuell fördelning för stapeldiagrammet
  const malePercentage = programDistributions.map((d, i) => {
    const total = viewMode === 'applicants'
      ? d.maleApplicants + d.femaleApplicants + d.otherApplicants
      : d.maleAccepted + d.femaleAccepted + d.otherAccepted;
    return viewMode === 'applicants'
      ? (d.maleApplicants / total) * 100
      : (d.maleAccepted / total) * 100;
  });

  const femalePercentage = programDistributions.map((d, i) => {
    const total = viewMode === 'applicants'
      ? d.maleApplicants + d.femaleApplicants + d.otherApplicants
      : d.maleAccepted + d.femaleAccepted + d.otherAccepted;
    return viewMode === 'applicants'
      ? (d.femaleApplicants / total) * 100
      : (d.femaleAccepted / total) * 100;
  });

  const otherPercentage = programDistributions.map((d, i) => {
    const total = viewMode === 'applicants'
      ? d.maleApplicants + d.femaleApplicants + d.otherApplicants
      : d.maleAccepted + d.femaleAccepted + d.otherAccepted;
    return viewMode === 'applicants'
      ? (d.otherApplicants / total) * 100
      : (d.otherAccepted / total) * 100;
  });

  const barData = {
    labels: years,
    datasets: [
      {
        label: 'Män (%)',
        data: malePercentage,
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Kvinnor (%)',
        data: femalePercentage,
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Övriga (%)',
        data: otherPercentage,
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Könsfördelning över tid - ${viewMode === 'applicants' ? 'Sökande' : 'Antagna'}`,
        font: {
          size: 16
        }
      },
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'År'
        }
      },
      y: {
        stacked: true,
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Procent (%)'
        }
      }
    }
  };

  // Skapa en lista med program för dropdown
  const programs = distributions
    .filter(d => d.programId && d.year === selectedYear)
    .map(d => ({
      id: d.programId!,
      name: d.programName!
    }));

  return (
    <div className="gender-distribution">
      <h2>Könsfördelning bland sökande och antagna</h2>
      
      <div className="controls">
        <div className="program-selector">
          <label htmlFor="program-select">Välj program: </label>
          <select 
            id="program-select"
            value={selectedProgram || ''}
            onChange={handleProgramChange}
            className="program-select"
          >
            <option value="">Hela lärosätet</option>
            {programs.map(program => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="view-mode-selector">
          <label>Visa: </label>
          <div className="radio-group">
            <label>
              <input 
                type="radio" 
                name="viewMode" 
                value="applicants" 
                checked={viewMode === 'applicants'} 
                onChange={handleViewModeChange}
              />
              Sökande
            </label>
            <label>
              <input 
                type="radio" 
                name="viewMode" 
                value="accepted" 
                checked={viewMode === 'accepted'} 
                onChange={handleViewModeChange}
              />
              Antagna
            </label>
          </div>
        </div>
      </div>
      
      <div className="charts-container">
        <div className="pie-chart">
          <h3>Könsfördelning {selectedYear}</h3>
          <Pie data={pieData} options={pieOptions} />
        </div>
        
        <div className="bar-chart">
          <h3>Utveckling över tid</h3>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
      
      <div className="statistics-table">
        <h3>Detaljerad statistik ({selectedYear})</h3>
        <table>
          <thead>
            <tr>
              <th>Kön</th>
              <th>Antal sökande</th>
              <th>Andel sökande (%)</th>
              <th>Antal antagna</th>
              <th>Andel antagna (%)</th>
              <th>Antagningsgrad (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Män</td>
              <td>{selectedDistribution.maleApplicants}</td>
              <td>
                {((selectedDistribution.maleApplicants / 
                  (selectedDistribution.maleApplicants + 
                   selectedDistribution.femaleApplicants + 
                   selectedDistribution.otherApplicants)) * 100).toFixed(1)}%
              </td>
              <td>{selectedDistribution.maleAccepted}</td>
              <td>
                {((selectedDistribution.maleAccepted / 
                  (selectedDistribution.maleAccepted + 
                   selectedDistribution.femaleAccepted + 
                   selectedDistribution.otherAccepted)) * 100).toFixed(1)}%
              </td>
              <td>
                {((selectedDistribution.maleAccepted / 
                  selectedDistribution.maleApplicants) * 100).toFixed(1)}%
              </td>
            </tr>
            <tr>
              <td>Kvinnor</td>
              <td>{selectedDistribution.femaleApplicants}</td>
              <td>
                {((selectedDistribution.femaleApplicants / 
                  (selectedDistribution.maleApplicants + 
                   selectedDistribution.femaleApplicants + 
                   selectedDistribution.otherApplicants)) * 100).toFixed(1)}%
              </td>
              <td>{selectedDistribution.femaleAccepted}</td>
              <td>
                {((selectedDistribution.femaleAccepted / 
                  (selectedDistribution.maleAccepted + 
                   selectedDistribution.femaleAccepted + 
                   selectedDistribution.otherAccepted)) * 100).toFixed(1)}%
              </td>
              <td>
                {((selectedDistribution.femaleAccepted / 
                  selectedDistribution.femaleApplicants) * 100).toFixed(1)}%
              </td>
            </tr>
            <tr>
              <td>Övriga</td>
              <td>{selectedDistribution.otherApplicants}</td>
              <td>
                {((selectedDistribution.otherApplicants / 
                  (selectedDistribution.maleApplicants + 
                   selectedDistribution.femaleApplicants + 
                   selectedDistribution.otherApplicants)) * 100).toFixed(1)}%
              </td>
              <td>{selectedDistribution.otherAccepted}</td>
              <td>
                {((selectedDistribution.otherAccepted / 
                  (selectedDistribution.maleAccepted + 
                   selectedDistribution.femaleAccepted + 
                   selectedDistribution.otherAccepted)) * 100).toFixed(1)}%
              </td>
              <td>
                {((selectedDistribution.otherAccepted / 
                  selectedDistribution.otherApplicants) * 100).toFixed(1)}%
              </td>
            </tr>
            <tr className="total-row">
              <td>Totalt</td>
              <td>
                {selectedDistribution.maleApplicants + 
                 selectedDistribution.femaleApplicants + 
                 selectedDistribution.otherApplicants}
              </td>
              <td>100%</td>
              <td>
                {selectedDistribution.maleAccepted + 
                 selectedDistribution.femaleAccepted + 
                 selectedDistribution.otherAccepted}
              </td>
              <td>100%</td>
              <td>
                {(((selectedDistribution.maleAccepted + 
                   selectedDistribution.femaleAccepted + 
                   selectedDistribution.otherAccepted) / 
                  (selectedDistribution.maleApplicants + 
                   selectedDistribution.femaleApplicants + 
                   selectedDistribution.otherApplicants)) * 100).toFixed(1)}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenderDistributionDisplay; 