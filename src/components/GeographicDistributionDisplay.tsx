import React, { useEffect, useState } from 'react';
import { GeographicDistribution } from '../models/types';
import { getGeographicDistribution } from '../services/statisticsService';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Registrera Chart.js-komponenter
ChartJS.register(ArcElement, Tooltip, Legend);

interface GeographicDistributionDisplayProps {
  universityId: string;
  selectedYear?: number;
}

const GeographicDistributionDisplay: React.FC<GeographicDistributionDisplayProps> = ({ 
  universityId, 
  selectedYear 
}) => {
  const [distributions, setDistributions] = useState<GeographicDistribution[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDistribution, setSelectedDistribution] = useState<GeographicDistribution | null>(null);

  useEffect(() => {
    const fetchDistributions = async () => {
      if (!universityId) {
        setDistributions([]);
        setSelectedDistribution(null);
        return;
      }

      try {
        setLoading(true);
        const data = await getGeographicDistribution(universityId, selectedYear);
        setDistributions(data);
        
        // Välj den senaste distributionen om ingen år är valt
        // eller den specifika distributionen för det valda året
        if (data.length > 0) {
          if (selectedYear) {
            const yearDist = data.find(d => d.year === selectedYear);
            setSelectedDistribution(yearDist || data[data.length - 1]);
          } else {
            setSelectedDistribution(data[data.length - 1]);
          }
        } else {
          setSelectedDistribution(null);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Kunde inte hämta geografisk fördelning. Försök igen senare.');
        setLoading(false);
      }
    };

    fetchDistributions();
  }, [universityId, selectedYear]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(e.target.value);
    const dist = distributions.find(d => d.year === year);
    setSelectedDistribution(dist || null);
  };

  if (!universityId) {
    return <div className="no-selection">Välj ett lärosäte för att se geografisk fördelning</div>;
  }

  if (loading) {
    return <div>Laddar geografisk fördelning...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!selectedDistribution) {
    return <div>Ingen geografisk fördelning tillgänglig för detta lärosäte</div>;
  }

  // Förbereda data för cirkeldiagram
  // Vi visar bara de 10 största regionerna och grupperar resten som "Övriga"
  const topRegions = selectedDistribution.regionData.slice(0, 10);
  const otherRegions = selectedDistribution.regionData.slice(10);
  
  const otherPercentage = otherRegions.reduce((sum, region) => sum + region.percentage, 0);
  const otherApplicants = otherRegions.reduce((sum, region) => sum + region.applicantCount, 0);
  
  const chartLabels = [...topRegions.map(r => r.regionName)];
  const chartData = [...topRegions.map(r => r.percentage)];
  
  if (otherRegions.length > 0) {
    chartLabels.push('Övriga');
    chartData.push(otherPercentage);
  }
  
  // Generera slumpmässiga färger för diagrammet
  const generateColors = (count: number) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * 200);
      const g = Math.floor(Math.random() * 200);
      const b = Math.floor(Math.random() * 200);
      colors.push(`rgba(${r}, ${g}, ${b}, 0.7)`);
    }
    return colors;
  };
  
  const backgroundColor = generateColors(chartLabels.length);
  
  const pieData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartData,
        backgroundColor,
        borderColor: backgroundColor.map(color => color.replace('0.7', '1')),
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
        text: `Geografisk fördelning av sökande (${selectedDistribution.year})`,
      },
    },
  };

  return (
    <div className="geographic-distribution">
      <h2>Geografisk fördelning av sökande</h2>
      
      <div className="year-selector">
        <label htmlFor="year-select">Välj år: </label>
        <select 
          id="year-select"
          value={selectedDistribution.year}
          onChange={handleYearChange}
          className="year-select"
        >
          {distributions.map(dist => (
            <option key={dist.year} value={dist.year}>
              {dist.year}
            </option>
          ))}
        </select>
      </div>
      
      <div className="chart-container">
        <Pie data={pieData} options={pieOptions} />
      </div>
      
      <div className="region-table">
        <h3>Detaljerad geografisk fördelning</h3>
        <table>
          <thead>
            <tr>
              <th>Region</th>
              <th>Antal sökande</th>
              <th>Andel (%)</th>
            </tr>
          </thead>
          <tbody>
            {selectedDistribution.regionData.map(region => (
              <tr key={region.regionId}>
                <td>{region.regionName}</td>
                <td>{region.applicantCount}</td>
                <td>{region.percentage.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GeographicDistributionDisplay; 