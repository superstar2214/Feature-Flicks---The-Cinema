import { useEffect } from 'react';
import { useStates } from './utilities/states';
import MovieList from './MovieList';
import MovieDetail from './MovieDetail';
import { Routes, Route } from 'react-router-dom';
import { kebabify } from './utilities/kebabify';

export default function App() {

  const s = useStates('main', {
    movies: []
  });

  useEffect(() => {
    (async () => {
      // fetch alll movies from the REST api
      let movies = await (await fetch('/api/movies')).json();
      // add a slug to be used in url routes to each movie
      for (let movie of movies) {
        movie.slug = kebabify(movie.title);
      }
      // store the movies in our state variable
      s.movies = movies;
    })();
  }, []);

  return s.movies.length === 0 ? null : <>
    <Routes>
      <Route path="/" element={<MovieList />}></Route>
      <Route path="/movie-detail/:slug" element={<MovieDetail />} />
    </Routes>
  </>;
}