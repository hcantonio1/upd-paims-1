// FilterBy.js
import React, { useState } from 'react';

const FilterBy = ({ options, onFilterChange }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    onFilterChange(value);
  };

  return (
    <div>
      <label htmlFor="filterBy">Filter By:</label>
      <select id="filterBy" value={selectedOption} onChange={handleFilterChange}>
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterBy;
