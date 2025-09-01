import React, {useEffect, useState} from 'react'
import {useDebounce} from "react-use";

import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
};

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debounceSearchTerm, setDebounceSearchTerm] = useState('')

    useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm]);

    const fetchMovies = async (query = '') => {
        setIsLoading(true);
        setError('');

        try {
            const endpoint = query ?
                `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
                : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error(`Failed to fetch movies from API. Status: ${response.status}`);
            }

            const data = await response.json();

            if(data.reponse === 'false') {
                setError(data.error || 'Failed to fetch movies from API');
                setMovieList([]);
                return;
            }
            setMovieList(data.results || []);


        } catch (e) {
            console.error("Error fetching movies:", e);
            setError("Error fetching movies from API");
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchMovies(debounceSearchTerm);
    }, [debounceSearchTerm]);


    return (
        <main>
            <div className="pattern" />

            <div className="wrapper">
                <header>
                    <img src="/hero.png" alt="Hero Panner"/>
                    <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>

                    <Search searchTerm = {searchTerm} setSearchTerm={setSearchTerm} />
                </header>

                <section className="all-movies">
                    <h2 className="mt-[40px]">ALl Movies</h2>

                    {isLoading ? (
                        <Spinner />
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <ul>
                            {movieList.map(movie => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </ul>
                    )}
                </section>

            </div>
        </main>
    )
}
export default App
