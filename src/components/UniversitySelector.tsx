import React, { useEffect, useState } from 'react';
import { University } from '../models/types';
import { getUniversities } from '../services/statisticsService';

interface UniversitySelectorProps {
  onSelectUniversity: (universityId: string) => void;
}

const UniversitySelector: React.FC<UniversitySelectorProps> = ({ onSelectUniversity }) => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoading(true);
        const data = await getUniversities();
        setUniversities(data);
        setLoading(false);
      } catch (err) {
        setError('Kunde inte hämta lärosäten. Försök igen senare.');
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const universityId = e.target.value;
    setSelectedUniversity(universityId);
    onSelectUniversity(universityId);
  };

  if (loading) {
    return <div>Laddar lärosäten...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="university-selector">
      <h2>Välj lärosäte</h2>
      <select 
        value={selectedUniversity} 
        onChange={handleChange}
        className="university-select"
      >
        <option value="">-- Välj lärosäte --</option>
        {universities.map(university => (
          <option key={university.id} value={university.id}>
            {university.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UniversitySelector; 