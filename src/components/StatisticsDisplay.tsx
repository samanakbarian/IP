import React, { useEffect, useState } from 'react';
import { UniversityStatistics } from '../models/types';
import { getUniversityStatistics } from '../services/statisticsService';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Registrera Chart.js-komponenter
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StatisticsDisplayProps {
  universityId: string;
  onYearChange?: (year: number) => void;
}

const StatisticsDisplay: React.FC<StatisticsDisplayProps> = ({ universityId, onYearChange }) => {
  const [statistics, setStatistics] = useState<UniversityStatistics[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      if (!universityId) {
        setStatistics([]);
        return;
      }

      try {
        setLoading(true);
        const data = await getUniversityStatistics(universityId);
        setStatistics(data);
        
        // Välj det senaste året som standard
        if (data.length > 0) {
          const latestYear = data[data.length - 1].year;
          setSelectedYear(latestYear);
          if (onYearChange) {
            onYearChange(latestYear);
          }
        }
        
        setLoading(false);
      } catch (err) {
        setError('Kunde inte hämta statistik. Försök igen senare.');
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [universityId, onYearChange]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
    if (onYearChange) {
      onYearChange(year);
    }
  };

  if (!universityId) {
    return <div className="no-selection">Välj ett lärosäte för att se statistik</div>;
  }

  if (loading) {
    return <div>Laddar statistik...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (statistics.length === 0) {
    return <div>Ingen statistik tillgänglig för detta lärosäte</div>;
  }

  // Förbereda data för diagram
  const years = statistics.map(stat => stat.year.toString());
  const applicantsData = statistics.map(stat => stat.totalApplicants);
  const acceptedData = statistics.map(stat => stat.totalAcceptedStudents);

  const chartData = {
    labels: years,
    datasets: [
      {
        label: 'Antal sökande',
        data: applicantsData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Antal antagna',
        data: acceptedData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Utveckling över tid',
        padding: {
          bottom: 10,
          top: 10
        },
        font: {
          size: 16
        }
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Antal personer',
          font: {
            size: 14
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'År',
          font: {
            size: 14
          }
        }
      }
    }
  };

  // Beräkna trender
  const calculateTrend = (data: number[]) => {
    if (data.length < 2) return 'Otillräcklig data för trendanalys';
    
    const firstValue = data[0];
    const lastValue = data[data.length - 1];
    const percentChange = ((lastValue - firstValue) / firstValue) * 100;
    
    if (percentChange > 10) return 'Stark uppåtgående trend';
    if (percentChange > 0) return 'Svag uppåtgående trend';
    if (percentChange > -10) return 'Svag nedåtgående trend';
    return 'Stark nedåtgående trend';
  };

  const applicantsTrend = calculateTrend(applicantsData);
  const acceptedTrend = calculateTrend(acceptedData);

  return (
    <div className="statistics-display">
      <h2>Antagningsstatistik</h2>
      
      <div className="year-selector">
        <label htmlFor="statistics-year-select">Välj år för detaljerad statistik: </label>
        <select 
          id="statistics-year-select"
          value={selectedYear || ''}
          onChange={handleYearChange}
          className="year-select"
        >
          {statistics.map(stat => (
            <option key={stat.year} value={stat.year}>
              {stat.year}
            </option>
          ))}
        </select>
      </div>
      
      <div className="chart-container">
        <Line options={chartOptions} data={chartData} />
      </div>
      
      <div className="trend-analysis">
        <h3>Trendanalys</h3>
        <p><strong>Sökande:</strong> {applicantsTrend}</p>
        <p><strong>Antagna:</strong> {acceptedTrend}</p>
      </div>
      
      <div className="statistics-table">
        <h3>Detaljerad statistik</h3>
        <table>
          <thead>
            <tr>
              <th>År</th>
              <th>Antal sökande</th>
              <th>Antal antagna</th>
              <th>Antagningsgrad</th>
            </tr>
          </thead>
          <tbody>
            {statistics.map(stat => (
              <tr key={stat.year} className={selectedYear === stat.year ? 'selected-row' : ''}>
                <td>{stat.year}</td>
                <td>{stat.totalApplicants}</td>
                <td>{stat.totalAcceptedStudents}</td>
                <td>{((stat.totalAcceptedStudents / stat.totalApplicants) * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatisticsDisplay; 