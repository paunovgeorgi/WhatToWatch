import { useState, useEffect } from 'react'
import './App.css'
import Search from './components/Search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite';
import Genres from './components/Genres';
import Rating from './components/Rating';
import Year from './components/Year';
import Pagination from './components/Pagination';

const API_BASE_URL="https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Options for fetching data from the API
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

const App = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [rating, setRating] = useState('');
  const [year, setYear] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce search term to avoid making too many requests
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm]);

  // Fetch genres
  const fetchGenres = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/genre/movie/list?language=en`, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch genres');
      }

      const data = await response.json();
      setGenres(data.genres || []);

    } catch (error) {
      console.error(`error fetching genres: ${error}`);
    }
  };

  // Fetch movies based on search query or selected genre, rating, and year
  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');
  
    try {

      // Adjust endpoint based on search query or selected genre, rating, and year
      const endpoint = query ? 
      `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}` :
      `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&with_genres=${selectedGenre}&vote_average.gte=${rating}&primary_release_year=${year}&page=${page}`;
      const response = await fetch(endpoint, API_OPTIONS);
      
      if(!response.ok){
        throw new Error('Failed to fetch movies');
      }
  
      const data = await response.json();
  
      // Handle error response
      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies')
        setMovieList([]);
        return;
      }

      // Fetch external imdb IDs for each movie
      const moviesWithExternalIds = await Promise.all(data.results.map(async (movie) => {
        const externalIdsResponse = await fetch(`${API_BASE_URL}/movie/${movie.id}/external_ids`, API_OPTIONS);
        const externalIds = await externalIdsResponse.json();
        return { ...movie, imdb_id: externalIds.imdb_id };
      }));

      // Update total pages
      setTotalPages(data.total_pages < 100 ? data.total_pages : 100);

      // Update movie list
      setMovieList(moviesWithExternalIds || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
  
    } catch (error) {
      console.error(`error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again');
    }
    finally{
      setIsLoading(false);
    }
   }


   // Load trending movies
   const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
  
    } catch (error) {
      console.log(`error loading trending movies: ${error}`);
    }
   }
  

   // Fetch movies when debouncedSearchTerm, selectedGenre, rating, year, or page changes
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm, selectedGenre, rating, year, page])


  // Fetch trending movies and genres on initial load
  useEffect(() => {
    loadTrendingMovies();
    fetchGenres();
  }, [])

  // Reset page to 1 when selectedGenre, rating, or year changes
  useEffect(() => {
    setPage(1);
  }, [selectedGenre, rating, year]);


  // auto-scroll to all movies section when page changes
  useEffect(() => {
    const section = document.getElementById('all-movies-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }, [page]);



  return(
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="./wtw-logo-3.png" alt="" />
            <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
            <div className="selectables">
              <Genres genres={genres} selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre}/>
              <Rating rating={rating} setRating={setRating}/>
              <Year year={year} setYear={setYear}/>
            </div>
          </header>

          {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (

                <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

          <section id='all-movies-section' className="all-movies">
            <h2>All Movies</h2>

            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie}/>
                ))}
              </ul>
            )}

            <div className="pagination">
              <Pagination page={page} totalPages={totalPages} setPage={setPage}/>
            </div>

            {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
          </section>
        </div>
      </div>
    </main>

  )

}

export default App
