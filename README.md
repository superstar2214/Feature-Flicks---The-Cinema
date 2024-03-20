To use:
npm install
npm run dev

Components:
1. App Component:
The App component serves as the main entry point of the application.
It handles the routing using react-router-dom.
Fetches movies data from the REST API and stores them in the application state.
Renders MovieList and MovieDetail components based on the current route.
2. MovieList Component:
The MovieList component displays a list of movies available for screening.
Utilizes the MovieFilterSortWidget component for filtering and sorting movies.
Fetches screenings data from the REST API and organizes movies by categories.
Displays movie cards with basic information like title, image, and earliest screening time.
Allows users to filter movies by category and sort them by title or duration.
<img width="1428" alt="Screenshot 2024-03-20 at 22 48 00" src="https://github.com/superstar2214/Feature-Flicks---The-Cinema/assets/90936619/aa130c13-de1d-417b-9a03-0036d070a419">
4. MovieDetail Component:
The MovieDetail component displays detailed information about a selected movie.
Fetches screenings data based on the selected auditorium.
Displays screening times for the selected movie.
Allows users to select seats for booking.
Integrates the TicketComponent for managing ticket selection and booking.
5. TicketComponent Component:
The TicketComponent component manages the selection and booking of movie tickets.
Provides options to select the number of tickets for different categories (normal, senior, child).
Calculates the total price based on the selected number of tickets and respective prices.
Allows users to book tickets, and upon booking, displays a popup with the booking details.
6. MovieFilterSortWidget Component:
The MovieFilterSortWidget component provides UI elements for filtering and sorting movies.
Allows users to filter movies by category and sort them by title or duration.
Renders dropdowns for selecting category and sorting options.
Sends filter and sort options to the parent component for handling.
7. TicketComponent.css:
Contains CSS styles for the TicketComponent component.
Defines styles for the ticket selection interface and the booking popup.
8. Other Utility Components and CSS:
Contains other utility components like auto-key-lists.js for generating unique keys for lists.
Contains CSS files for styling different components like MovieList.css and MovieDetail.css.
Conclusion:
Each component in the project serves a specific purpose, contributing to the overall functionality of the movie booking application. By dividing the application into smaller, manageable components, it becomes easier to maintain, debug, and extend the functionality in the future.
