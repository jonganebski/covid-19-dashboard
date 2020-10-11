import express from "express";
import { getNews } from "./newsScrapper";
import path from "path";

const PORT = process.env.PORT || 4000;

const buildPath = path.join(__dirname, "..", "..", "build");

const app = express();

app.use(express.static(buildPath));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.post("/api/news", async (req, res) => {
  const { country } = req.body;
  const result = await getNews(country);
  res.send(result);
});

app.listen(PORT, () =>
  console.log(`✅ Express Server listening on port ${PORT}`)
);
