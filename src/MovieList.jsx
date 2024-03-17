import { useStates } from './utilities/states';
import { Link } from 'react-router-dom';
import './MovieList.css'; // Import CSS for styling

export default function MovieList() {
  const s = useStates('main');

  // Function to sort movies by category
  const sortMoviesByCategory = () => {
    // Create an object to store movies categorized by their categories
    const categorizedMovies = {};
    s.movies.forEach(movie => {
      movie.description.categories.forEach(category => {
        if (!categorizedMovies[category]) {
          categorizedMovies[category] = [];
        }
        categorizedMovies[category].push(movie);
      });
    });

    // Sort movies within each category
    for (const category in categorizedMovies) {
      categorizedMovies[category].sort((a, b) => a.title.localeCompare(b.title));
    }

    return categorizedMovies;
  };

  const categorizedMovies = sortMoviesByCategory();

  return (
    <>
      {Object.keys(categorizedMovies).map(category => (
        <div key={category} className="category-container"> {/* Apply CSS class */}
          <h2>{category}</h2>
          <div className="movies-container"> {/* Container for movies */}
            {categorizedMovies[category].map(({ slug, title, description: d }) => (
              <Link key={slug} to={'/movie-detail/' + slug}>
                <div className="movie">
                  <h3>{title}</h3>
                  <img src={'https://cinema-rest.nodehill.se' + d.posterImage} alt={title} />
                  <p>Length: {d.length}</p>
                  <hr />
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
