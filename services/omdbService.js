require("dotenv").config()
const axios = require('axios');
const API_KEY = process.env.API_KEY; 
const Rating = require('../models/Rating');

const allGenres = [
    'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary',
    'Drama', 'Family', 'Fantasy', 'Film-Noir', 'History', 'Horror', 'Music', 'Musical',
    'Mystery', 'Romance', 'Sci-Fi', 'Short', 'Sport', 'Thriller', 'War', 'Western'
];
// Fungsi untuk mengambil film berdasarkan keyword
async function searchMovies(keyword) {
    try {
        console.log('Searching for:', keyword);
        const response = await axios.get(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${keyword}`);
        console.log('API Response:', response.data);
        return response.data.Search || [];
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
}

// Fungsi untuk mengambil film random berdasarkan huruf A-Z
async function getRandomMovies() {
    console.log('Fetching movies for all genres:', allGenres); // Debugging

    // Mengambil film berdasarkan semua genre
    const moviesPromises = allGenres.map(genre => searchMovies(genre));
    const moviesResults = await Promise.all(moviesPromises);

    const allMovies = moviesResults.flat();
    console.log('All Movies:', allMovies);

    // Hapus duplikat berdasarkan imdbID
    const uniqueMovies = Array.from(new Map(allMovies.map(movie => [movie.imdbID, movie])).values());

    // Ambil lebih banyak film secara acak
    const randomMovies = uniqueMovies.sort(() => 0.5 - Math.random()).slice(0, 52); // Ambil 50 film secara acak

    return randomMovies;
}

async function getMovieDetails(imdbID) {
    try {
        const response = await axios.get(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`);
        return response.data;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
    }
}
async function getAverageRating(movieId) {
    const ratings = await Rating.find({ movieId });
    if (ratings.length === 0) return null;
  
    const sum = ratings.reduce((total, r) => total + r.rating, 0);
    return (sum / ratings.length).toFixed(1);
}

async function searchMoviesByGenre(keyword, targetGenre) {
    const results = await searchMovies(keyword);

    const detailedMovies = await Promise.all(
        results.map(movie => getMovieDetails(movie.imdbID))
    );

    const filtered = detailedMovies.filter(movie =>
        movie && movie.Genre && movie.Genre.toLowerCase().includes(targetGenre.toLowerCase())
    );

    return filtered;
}

module.exports = {
    searchMovies,
    getRandomMovies,
    getMovieDetails,
    getAverageRating,
    searchMoviesByGenre
};
