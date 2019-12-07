const express = require("express");
const data = require("./movie-data-light.json");
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");

const app = express();
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get("Authorization");
  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "unauthorized request" });
  }
  next();
});

app.get("/movie", function handleGetMovies(req, res) {
  let response = data;
  if (req.query.genre) {
    response = response.filter(movie =>
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    );
  }

  if (req.query.country) {
    response = response.filter(movie =>
      movie.country.toLowerCase().includes(req.query.country.toLowerCase())
    );
  }

  if (req.query.avg_vote) {
    response = response.filter(
      movie => movie.avg_vote >= Number(req.query.avg_vote)
    );
  }

  res.json(response);
});

app.listen(8000, () => {
  console.log("server is running");
});
