import cors from "cors";
import express from "express";
import { getNews } from "./newsScrapper";

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: "http://localhost:3000" }));

app.post("/", async (req, res) => {
  const { country } = req.body;
  const result = await getNews(country);
  res.send(result);
});

app.listen(4000, () => console.log("✅ Express Server listening."));
