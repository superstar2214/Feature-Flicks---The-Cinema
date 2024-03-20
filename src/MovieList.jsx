import React, { useState, useEffect } from 'react';
import { useStates } from './utilities/states';
import { Link } from 'react-router-dom';
import MovieFilterSortWidget from './MovieFilterSortWidget';
import './MovieList.css';

export default function MovieList() {
  const [screenings, setScreenings] = useState([]);
  const s = useStates('main');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    fetch('/api/screenings')
      .then(response => response.json())
      .then(data => setScreenings(data))
      .catch(error => console.error('Error fetching screenings:', error));
  }, []);

  const sortMoviesByCategory = (category) => {
    return s.movies.filter(movie => category === '' || movie.description.categories.includes(category));
  };

  const handleFilterChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
  };

  const filteredMovies = sortMoviesByCategory(selectedCategory);

  if (sortBy === 'title') {
    filteredMovies.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === 'length') {
    filteredMovies.sort((a, b) => a.description.length - b.description.length);
  }

  const groupedMovies = {};
  filteredMovies.forEach(movie => {
    movie.description.categories.forEach(category => {
      if (!groupedMovies[category]) {
        groupedMovies[category] = [];
      }
      if (!groupedMovies[category].find(m => m.id === movie.id)) {
        groupedMovies[category].push(movie);
      }
    });
    if (movie.description.categories.length === 0) {
      const defaultCategory = 'Other';
      if (!groupedMovies[defaultCategory]) {
        groupedMovies[defaultCategory] = [];
      }
      groupedMovies[defaultCategory].push(movie);
    }
  });

  return (
    <>
      <MovieFilterSortWidget
        categories={['', ...Array.from(new Set(s.movies.flatMap(movie => movie.description.categories)))]}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />
      <div className="category-container">
        {Object.keys(selectedCategory ? { [selectedCategory]: groupedMovies[selectedCategory] } : groupedMovies).map(category => (
          <div key={category}>
            <h2>{category}</h2>
            <div className="movies-container">
              {groupedMovies[category].map(({ id, slug, title, description: d }) => {
                const movieScreenings = screenings.filter(screening => screening.movieId === id);
                movieScreenings.sort((a, b) => new Date(a.time) - new Date(b.time));
                const earliestScreening = movieScreenings.length > 0 ? new Date(movieScreenings[0].time) : null;

                return (
                  <Link key={slug} to={'/movie-detail/' + slug}>
                    <div className="movie-card">
                      <div className="movie-image">
                        <img src={'https://cinema-rest.nodehill.se' + d.posterImage} alt={title} />
                      </div>
                      <div className="movie-info">
                        <h3>{title}</h3>
                        {earliestScreening && (
                          <p>Earliest Screening: {earliestScreening.toLocaleString()}</p>
                        )}
                        <p>Movie Duration: {d.length} min</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
