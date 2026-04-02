import { useEffect, useState } from "react";

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5075/api/movies")
      .then(res => res.json())
      .then(data => setMovies(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🎬 Filmų platforma</h1>

      {movies.length === 0 ? (
        <p>Kraunasi...</p>
      ) : (
        <ul>
          {movies.map(movie => (
            <li key={movie.id}>
              {movie.title} - {movie.genre}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;