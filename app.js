const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const mongoose = require('./db');
const { getRandomMovies, searchMovies, getMovieDetails, getAverageRating} = require('./services/omdbService');
const User = require('./models/User');
const Favorite_Movies = require('./models/Favorite_Movies');
const Comment = require('./models/Comment');
const Rating = require('./models/Rating');
const adminRoutes = require('./routes/admin')
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Home Page
app.get('/', async (req, res) => {
    let movies = await getRandomMovies();
    console.log(req.session.user);
    movies = movies.filter(movie => movie.Type === "movie"); //memastikan hanya film yang ditampilkan
    res.render('home', { movies, title: 'For You', user: req.session.user });
});

// Search Movies
const searchRoutes = require('./routes/search');
app.use('/', searchRoutes);


// Add to Favorites
const favoriteRoutes = require('./routes/favorite');
app.use(favoriteRoutes);


// Signup Page
app.get('/signup', (req, res) => {
    res.render('signup', {error: ""});
});

// 
const authRoutes = require('./routes/authRoutes');
app.use('/', authRoutes);

// Login Page
app.get('/login', (req, res) => {
    res.render('login', {error: ""});
});


// movie
const movieRoutes = require('./routes/movie');
app.use('/', movieRoutes);


// Comment
const commentRoutes = require('./routes/comment');
app.use('/', commentRoutes);


// Rating
const ratingRouter = require('./routes/rating');
app.use('/', ratingRouter); 

//profile
const profileRoutes = require('./routes/profile');
app.use('/', profileRoutes);


//admin routes
app.use('/admin', adminRoutes);

// Gunakan genre 
const genreRoutes = require('./routes/genre'); 
app.use('/genre', genreRoutes);

// Server Running
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
