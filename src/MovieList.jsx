import { useState, useEffect } from 'react';
import { useStates } from './utilities/states';
import { Link } from 'react-router-dom';
import MovieFilterSortWidget from './MovieFilterSortWidget';
import './MovieList.css'; // Import CSS for styling

export default function MovieList() {
  const [screenings, setScreenings] = useState([]); // State to store screenings
  const s = useStates('main');
  const [selectedCategory, setSelectedCategory] = useState(''); // State to track selected category
  const [sortBy, setSortBy] = useState(''); // State to track sorting option

  useEffect(() => {
    // Fetch screenings data
    fetch('/api/screenings')
      .then(response => response.json())
      .then(data => setScreenings(data))
      .catch(error => console.error('Error fetching screenings:', error));
  }, []);

  // Function to sort movies by category
  const sortMoviesByCategory = (category) => {
    // Filter movies by category
    return s.movies.filter(movie => category === '' || movie.description.categories.includes(category));
  };

  // Function to handle category filter change
  const handleFilterChange = (category) => {
    setSelectedCategory(category);
  };

  // Function to handle sorting change
  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
  };

  // Filter movies by selected category and sort them if needed
  const filteredMovies = sortMoviesByCategory(selectedCategory);

  // Sort movies if a sorting option is selected
  if (sortBy === 'title') {
    filteredMovies.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === 'length') {
    filteredMovies.sort((a, b) => a.description.length - b.description.length);
  }
  // Add more sorting options as needed

  // Group movies by category
  const groupedMovies = {};
  filteredMovies.forEach(movie => {
    movie.description.categories.forEach(category => {
      if (!groupedMovies[category]) {
        groupedMovies[category] = [];
      }
      groupedMovies[category].push(movie);
    });
  });

  // Render movie cards
  return (
    <>
      <MovieFilterSortWidget
        categories={['', ...Array.from(new Set(s.movies.flatMap(movie => movie.description.categories)))]}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />
      {Object.keys(groupedMovies).map(category => (
        <div key={category} className="category-container">
          <h2>{selectedCategory || category}</h2>
          <div className="movies-container">
            {groupedMovies[category].map(({ id, slug, title, description: d }) => {
              // Find screenings for the current movie
              const movieScreenings = screenings.filter(screening => screening.movieId === id); // Use movie id directly from movie data
              // Sort screenings by time
              movieScreenings.sort((a, b) => new Date(a.time) - new Date(b.time));
              // Get the earliest screening time
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
    </>
  );
}
