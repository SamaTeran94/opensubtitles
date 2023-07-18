/* eslint-disable no-undef */
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

app.get("/api/v1/subtitles", async (req, res) => {
  const { query, imdb_id, year, languages } = req.query;

  try {
    const response = await axios.get(
      "https://api.opensubtitles.com/api/v1/subtitles",
      {
        params: {
          query: query,
          imdb_id: imdb_id,
          year: year,
          languages: languages,
        },
        headers: { "Api-Key": "j0HWhfDIHxcE0qcPCUpnOIZUh4D1sU61" },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.message });
  }
});

app.get("/api/v1/discover/most_downloaded", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.opensubtitles.com/api/v1/discover/most_downloaded",
      {
        params: { languages: "en" },
        headers: { "Api-Key": "j0HWhfDIHxcE0qcPCUpnOIZUh4D1sU61" },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});
