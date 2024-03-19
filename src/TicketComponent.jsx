import React, { useState } from 'react';

const TicketComponent = ({ availableSeats, bookingCounter }) => {
  const [normalTickets, setNormalTickets] = useState(0);
  const [seniorTickets, setSeniorTickets] = useState(0);
  const [childTickets, setChildTickets] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0); // New state to track total tickets

  const normalPrice = 85;
  const seniorPrice = 75;
  const childPrice = 65;

  const increaseTickets = (type) => {
    switch (type) {
      case 'normal':
        setNormalTickets(normalTickets + 1);
        break;
      case 'senior':
        setSeniorTickets(seniorTickets + 1);
        break;
      case 'child':
        setChildTickets(childTickets + 1);
        break;
      default:
        break;
    }
    setTotalTickets(totalTickets + 1); // Increment total tickets when increasing a ticket type
  };

  const decreaseTickets = (type) => {
    switch (type) {
      case 'normal':
        if (normalTickets > 0) {
          setNormalTickets(normalTickets - 1);
          setTotalTickets(totalTickets - 1); // Decrement total tickets when decreasing a ticket type
        }
        break;
      case 'senior':
        if (seniorTickets > 0) {
          setSeniorTickets(seniorTickets - 1);
          setTotalTickets(totalTickets - 1); // Decrement total tickets when decreasing a ticket type
        }
        break;
      case 'child':
        if (childTickets > 0) {
          setChildTickets(childTickets - 1);
          setTotalTickets(totalTickets - 1); // Decrement total tickets when decreasing a ticket type
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="ticket-component">
      <h4>Tickets</h4>
      <div className="ticket-types">
        <div className="ticket-type">
          <span>Normal:</span>
          <button onClick={() => decreaseTickets('normal')}>-</button>
          <span>{normalTickets}</span>
          <button onClick={() => increaseTickets('normal')}>+</button>
          <span>Total: SEK {normalTickets * normalPrice}</span>
        </div>
        <div className="ticket-type">
          <span>Senior:</span>
          <button onClick={() => decreaseTickets('senior')}>-</button>
          <span>{seniorTickets}</span>
          <button onClick={() => increaseTickets('senior')}>+</button>
          <span>Total: SEK {seniorTickets * seniorPrice}</span>
        </div>
        <div className="ticket-type">
          <span>Child:</span>
          <button onClick={() => decreaseTickets('child')}>-</button>
          <span>{childTickets}</span>
          <button onClick={() => increaseTickets('child')}>+</button>
          <span>Total: SEK {childTickets * childPrice}</span>
        </div>
      </div>
      {totalTickets === bookingCounter && totalTickets > 0 && ( // Render "Book" button conditionally
        <button className="book-button">Book</button>
      )}
    </div>
  );
};

export default TicketComponent;
