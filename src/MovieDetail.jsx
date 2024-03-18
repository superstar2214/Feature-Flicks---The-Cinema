import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStates } from './utilities/states';
import './MovieDetail.css'; // Import CSS for styling

export default function MovieDetail() {
  const { slug } = useParams();
  const s = useStates('main');
  const [screenings, setScreenings] = useState([]);
  const [selectedAuditorium, setSelectedAuditorium] = useState('');
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    // Fetch screenings overview data
    fetch('/api/screenings_overview')
      .then(response => response.json())
      .then(data => setScreenings(data))
      .catch(error => console.error('Error fetching screenings overview:', error));

    // Find the movie based on the slug
    const selectedMovie = s.movies.find(movie => movie.slug === slug);
    setMovie(selectedMovie);
  }, [slug, s.movies]);

  const handleAuditoriumButtonClick = (auditorium) => {
    setSelectedAuditorium(auditorium);
  };

  return (
    <div className="movie-detail-container">
      {movie && (
        <div className="movie-card">
          <div className="movie-image">
            <img src={`https://cinema-rest.nodehill.se${movie.description.posterImage}`} alt={movie.title} />
          </div>
          <div className="movie-info">
            <h3>{movie.title}</h3>
            <h4>Length: {movie.description.length} minutes</h4>
            <h4>Categories: {movie.description.categories.join(', ')}</h4>
          </div>
        </div>
      )}
      <div className="auditorium-section">
        <h4>Auditorium</h4>
        <div className="auditorium-buttons">
          <button onClick={() => handleAuditoriumButtonClick('Lilla Salongen')}>Lilla Salongen</button>
          <button onClick={() => handleAuditoriumButtonClick('Stora Salongen')}>Stora Salongen</button>
        </div>
      </div>
      {selectedAuditorium && (
        <div className="screening-times-section">
          <h4 style={{ textAlign: 'center' }}>Screening Times</h4>
          <div className="screening-times-buttons">
            {screenings
              .filter(screening => screening.movie === movie.title && screening.auditorium === selectedAuditorium)
              .map(screening => (
                <button key={screening.screeningId} className="screening-time-button">
                  {new Date(screening.screeningTime).toLocaleString()}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
