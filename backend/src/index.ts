import cheerio from "cheerio";
import axios from "axios";
import express from "express";
import cors from "cors";

const getNews = async (country: string) => {
  const { data: html } = await axios.get(
    `https://news.google.com/search?q=covid-19+${country}+when:2d&hl=en-US&gl=US&ceid=US:en`
  );
  const selector = cheerio.load(html);
  const allResult: any[] = [];
  selector("main.HKt8rc")
    .find("article.MQsxIb")
    .each(function (_, el) {
      const title = selector(el).find("h3").text();
      const source = selector(el).find("a.wEwyrc").text();
      const date = selector(el).find("time").text();
      const link = `https://news.google.com${selector(el)
        .find("a")
        .attr("href")}`;
      allResult.push({ title, source, date, link });
    });
  const result = allResult.filter((d) => d.title !== "").slice(0, 10);
  return result;
};

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: "http://localhost:3000" }));

app.post("/", async (req, res) => {
  const { country } = req.body;
  console.log(country);
  const result = await getNews(country);
  res.send(result);
});

app.listen(4000, () => console.log("✅ Express Server listening."));
