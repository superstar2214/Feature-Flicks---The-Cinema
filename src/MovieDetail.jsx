import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStates } from './utilities/states';
import TicketComponent from './TicketComponent'; // Import the TicketComponent
import './MovieDetail.css'; // Import CSS for styling

export default function MovieDetail() {
  const { slug } = useParams();
  const s = useStates('main');
  const movie = s.movies.find(movie => movie.slug === slug);
  const { title, description } = movie;
  const { length, categories, posterImage } = description;

  const [screenings, setScreenings] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [seats, setSeats] = useState([]);
  const [bookingCounter, setBookingCounter] = useState(0); // New state to track booking count

  // Calculate the number of available grey seats
  const availableSeats = seats.reduce((total, row) => {
    return total + row.filter(seat => !occupiedSeats.includes(seat.seatNumber)).length;
  }, 0);

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

  const handleClick = (seatNumber) => {
    if (occupiedSeats.includes(seatNumber)) {
      // Unbook the seat and decrement the counter
      setOccupiedSeats(occupiedSeats.filter(seat => seat !== seatNumber));
      setBookingCounter(prevCounter => prevCounter - 1);
    } else {
      // Book the seat and increment the counter
      setOccupiedSeats([...occupiedSeats, seatNumber]);
      setBookingCounter(prevCounter => prevCounter + 1);
    }
  };

  const handleScreeningClick = async (screeningId) => {
    try {
      const screening = (await (await fetch(`/api/occupied_seats?screeningId=${screeningId}`)).json())[0];
      screening.occupiedSeats = screening.occupiedSeats.split(', ').map(x => +x);
      s.screening = screening;

      s.movie = (await (await fetch(`/api/movies?title=${screening.movie}`)).json())[0];

      const auditoriumId = ['Stora Salongen', 'Lilla Salongen'].indexOf(s.screening.auditorium) + 1;

      const seats = await (await fetch(`/api/seats/?auditoriumId=${auditoriumId}&sort=seatNumber`)).json();
      let rows = [];
      let row;
      let latestRow;

      for (let seat of seats) {
        seat.occupied = screening.occupiedSeats.includes(seat.seatNumber);
        if (latestRow !== seat.rowNumber) {
          row = [];
          rows.push(row);
        }
        row.push(seat);
        latestRow = seat.rowNumber
      }
      s.seats = rows;
      setOccupiedSeats(screening.occupiedSeats);
      setSeats(rows);
    } catch (error) {
      console.error('Error fetching screening details:', error);
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
      <div className="screenings-section">
        <h4>Screenings</h4>
        <div className="screenings-buttons">
          {screenings.map(screening => (
            <button key={screening.id} onClick={() => handleScreeningClick(screening.id)}>{screening.time}</button>
          ))}
        </div>
      </div>
      <div className="seats-section">
        <h4>Seats</h4>
        <div className="seats-buttons">
          {seats.map((row, rowIndex) => (
            <div key={rowIndex} className="seat-row" style={{ textAlign: 'center' }}>
              {row.map(seat => (
                <button
                  key={seat.seatNumber}
                  disabled={seat.occupied}
                  style={{
                    backgroundColor: occupiedSeats.includes(seat.seatNumber) ? 'green' : 'grey',
                    cursor: seat.occupied ? 'not-allowed' : 'pointer'
                  }}
                  onClick={() => handleClick(seat.seatNumber)}>
                  {seat.seatNumber}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <TicketComponent availableSeats={availableSeats} bookingCounter={bookingCounter} /> {/* Integrate TicketComponent here */}
    </div>
  );
}
