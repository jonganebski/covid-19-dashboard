import axios from "axios";
import cheerio from "cheerio";

// ------------- TYPE -------------

type TNews = {
  title: string;
  source: string;
  date: string;
  link: string;
};

// ------------- SUB FUNCTIONS -------------

const filterAndSlice = (allNews: TNews[], length: number) =>
  allNews.filter((d) => d.title !== "").slice(0, length);

const scrapeAllNews = (selector: cheerio.Root) => {
  const allNews: TNews[] = [];
  selector("main.HKt8rc")
    .find("article.MQsxIb")
    .each(function (_, el) {
      const title = selector(el).find("h3").text();
      const source = selector(el).find("a.wEwyrc").text();
      const date = selector(el).find("time").text();
      const link = `https://news.google.com${selector(el)
        .find("a")
        .attr("href")}`;
      allNews.push({ title, source, date, link });
    });
  return allNews;
};

// ------------- MAIN FUNCTION -------------

export const getNews = async (country: string) => {
  const length = 10;

  let searchTerm: string;
  if (country === "Georgia") {
    searchTerm = "tbilisi";
  } else {
    searchTerm = country;
  }

  const URL = `https://news.google.com/search?q=covid-19+${searchTerm}+when:2d&hl=en-US&gl=US&ceid=US:en`;

  const { data: html } = await axios.get(URL);

  const selector = cheerio.load(html);

  const allNews = scrapeAllNews(selector);

  const result = filterAndSlice(allNews, length);

  return result;
};
