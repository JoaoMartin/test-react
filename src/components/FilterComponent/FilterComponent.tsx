import React, { ChangeEvent } from 'react';
import styles from './FilterComponent.module.css';

interface FilterComponentProps {
  onFilterChange: (filters: { gender?: string; nat?: string }) => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({ onFilterChange }) => {
  const handleGenderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ gender: e.target.value });
  };

  const handleNatChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ nat: e.target.value });
  };

  return (
    <div className={styles.filterContainer}>
      <select onChange={handleGenderChange} className={styles.select}>
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <select onChange={handleNatChange} className={styles.select}>
        <option value="">Select Nationality</option>
        <option value="US">United States</option>
        <option value="GB">Great Britain</option>
        <option value="FR">France</option>
        {/* Add more options as needed */}
      </select>
    </div>
  );
};

export default FilterComponent;
