import React, { useState } from 'react';

function MovieFilterSortWidget({ categories, selectedCategory, onFilterChange, onSortChange }) {
  const [sortBy, setSortBy] = useState('');

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    onFilterChange(category);
  };

  const handleSortChange = (event) => {
    const sortOption = event.target.value;
    setSortBy(sortOption);
    onSortChange(sortOption);
  };

  return (
    <div className="filter-sort-widget">
      <label htmlFor="category-select">Filter by Category:</label>
      <select id="category-select" value={selectedCategory} onChange={handleCategoryChange}>
        <option value="">All</option>
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      <label htmlFor="sort-select">Sort by:</label>
      <select id="sort-select" value={sortBy} onChange={handleSortChange}>
        <option value="">None</option>
        <option value="title">Title</option>
        <option value="length">Length</option>
        <option value="screening">Screening</option>
      </select>
    </div>
  );
}

export default MovieFilterSortWidget;
