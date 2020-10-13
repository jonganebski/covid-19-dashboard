import axios from "axios";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import path from "path";
import { getNews } from "./newsScrapper";

const PORT = process.env.PORT || 4000;

const buildPath = path.join(__dirname, "..", "..", "build");

const app = express();

app.use(helmet());
app.use(express.static(buildPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

process.env.NODE_ENV === "dev" &&
  app.use(cors({ origin: "http://localhost:3000" }));

app.post("/api/news", async (req, res) => {
  const { country } = req.body;
  const result = await getNews(country);
  res.send(result);
});

app.listen(PORT, () =>
  console.log(`✅ Express Server listening on port ${PORT}`)
);
