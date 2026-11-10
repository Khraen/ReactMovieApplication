import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const API_KEY = 'e858e4afd001a4db65bcf425d55470c9'; 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentSort, setCurrentSort] = useState('');
  const [movies, setMovies] = useState([]);

  // Fetch movies from TMDB API
  useEffect(() => {
    let url;
    if (currentQuery) {
      url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(currentQuery)}&page=${currentPage}`;
    } else {
      url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${currentPage}`;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        let fetchedMovies = data.results || [];
        setTotalPages(data.total_pages || 1);

        // Apply sorting based on selected option
        if (currentSort === 'release-date-asc') {
          fetchedMovies.sort((a, b) => new Date(a.release_date || '') - new Date(b.release_date || ''));
        } else if (currentSort === 'release-date-desc') {
          fetchedMovies.sort((a, b) => new Date(b.release_date || '') - new Date(a.release_date || ''));
        } else if (currentSort === 'rating-asc') {
          fetchedMovies.sort((a, b) => a.vote_average - b.vote_average);
        } else if (currentSort === 'rating-desc') {
          fetchedMovies.sort((a, b) => b.vote_average - a.vote_average);
        }

        setMovies(fetchedMovies);
      })
      .catch((error) => {
        console.error('Error fetching data from TMDB:', error);
      });
  }, [currentPage, currentQuery, currentSort]);

  const handleSearchInput = (e) => {
    setCurrentQuery(e.target.value.trim());
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setCurrentSort(e.target.value);
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="app-container">
      {/* Header & Controls */}
      <header className="header">
        <h1>Movie Explorer</h1>
        <div className="controls">
          <input 
            type="text" 
            id="search-input" 
            placeholder="Search for a movie..." 
            onChange={handleSearchInput}
          />
          <select id="sort-select" value={currentSort} onChange={handleSortChange}>
            <option value="" disabled>Sort By</option>
            <option value="release-date-asc">Release Date (Asc)</option>
            <option value="release-date-desc">Release Date (Desc)</option>
            <option value="rating-asc">Rating (Asc)</option>
            <option value="rating-desc">Rating (Desc)</option>
          </select>
        </div>
      </header>

      {/* Movie Grid Container */}
      <main>
        <div id="movie-grid" className="movie-grid">
          {movies.length === 0 ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>No movies found.</p>
          ) : (
            movies.map((movie) => {
              const posterUrl = movie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                : 'https://via.placeholder.com/500x750?text=No+Image';

              return (
                <div className="movie-card" key={movie.id}>
                  <img src={posterUrl} alt={movie.title} />
                  <div className="movie-info">
                    <h3>{movie.title}</h3>
                    <p>Release Date: {movie.release_date || 'N/A'}</p>
                    <p>Rating: {movie.vote_average ?? 'N/A'}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Pagination Footer */}
      <footer className="pagination-footer">
        <button id="prev-btn" disabled={currentPage === 1} onClick={handlePrevClick}>Previous</button>
        <span id="page-info">Page {currentPage} of {totalPages}</span>
        <button id="next-btn" disabled={currentPage >= totalPages} onClick={handleNextClick}>Next</button>
      </footer>
    </div>
  );
}

export default App;