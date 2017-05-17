const express = require('express');
const parser = require('body-parser');
const request = require('request');
const http = require('http')
const app = express();

// const jsonData = require('./themoviedb_data.json')
const apiKey = "8acba41f5db614dec5f9b55978b9c002"

const router = express.Router();
router.use(parser.json());

router.get('/api/getPopularMovies', (request, response) => {
  http.get(`http://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1&include_adult=false`, (res) => {
    let str = '';
    res.on('data', function (chunk) {
       str += chunk;
    });
    res.on('end', function () {
         response.setHeader('Content-Type', 'application/json')
         response.send(JSON.parse(str))
    });
  });
});

router.get('/api/:movieId/getMovieCast', (request, response) => {
  const movieId = request.params.movieId;
  http.get(`http://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`, (res) => {
    let str = '';
    res.on('data', function (chunk) {
       str += chunk;
    });
    res.on('end', function () {
         response.setHeader('Content-Type', 'application/json')
         response.send(JSON.parse(str))
    });
  });
});

router.get('/api/:movieId/searchMoviebyId', (request, response) => {
  const movieId = request.params.movieId;
  http.get(`http://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`, (res) => {
    let str = '';
    res.on('data', function (chunk) {
       str += chunk;
    });
    res.on('end', function () {
         response.setHeader('Content-Type', 'application/json')
         response.send(JSON.parse(str))
    });
  });
});

module.exports = router;
