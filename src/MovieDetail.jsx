import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStates } from './utilities/states';
import './MovieDetail.css'; // Import CSS for styling

export default function MovieDetail() {
  const { slug } = useParams();
  const s = useStates('main');
  const movie = s.movies.find(movie => movie.slug === slug);
  const { title, description } = movie;
  const { length, categories, posterImage } = description;

  const [screenings, setScreenings] = useState([]);

  const fetchScreeningsByAuditorium = async (auditoriumId) => {
    try {
      const response = await fetch(`/api/screenings?movieId=${movie.id}&auditoriumId=${auditoriumId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch screenings');
      }
      const data = await response.json();
      setScreenings(data);
    } catch (error) {
      console.error('Error fetching screenings:', error);
    }
  };

  return (
    <div className="movie-detail-container">
      <div className="movie-card">
        <div className="movie-image">
          <img src={'https://cinema-rest.nodehill.se' + posterImage} alt={title} />
        </div>
        <div className="movie-info">
          <h3>{title}</h3>
          <h4>Length: {length} minutes</h4>
          <h4>Categories: {categories.join(', ')}</h4>
        </div>
      </div>
      <div className="auditorium-section">
        <h4>Auditorium</h4>
        <div className="auditorium-buttons">
          <button onClick={() => fetchScreeningsByAuditorium(2)}>Lilla Salongen</button>
          <button onClick={() => fetchScreeningsByAuditorium(1)}>Stora Salongen</button>
        </div>
      </div>
      {screenings.length > 0 && (
        <div className="screenings-section">
          <h4 style={{ textAlign: 'center' }}>Screenings</h4>
          <div className="screenings-buttons" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            {screenings.map(screening => (
              <button key={screening.id}>{screening.time}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
