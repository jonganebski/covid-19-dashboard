import cors from "cors";
import express from "express";
import helmet from "helmet";
import path from "path";
import { getNews } from "./newsScrapper";

const PORT = process.env.PORT || 4000;

const buildPath = path.join(__dirname, "..", "..", "build");

const app = express();

// 리액트와 익스프레스를 동시에 올리면 CSP부분을 포기해야 된다. 아니면 리액트 내에 fetch가 전혀 없어야 된다.
// 리액트 내부의 axios를 전부 백엔드로 옮겨봤지만 Leaflet Map 에서조차 CSP에 걸리는 에러에서 포기했다. ^^
app.use(helmet({ contentSecurityPolicy: false }));

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
