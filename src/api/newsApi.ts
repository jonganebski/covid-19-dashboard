import axios from "axios";
import { TNewsData } from "../types";

const NEWS_API_URL =
  (process.env.NODE_ENV === "development" &&
    "http://localhost:4000/api/news") ||
  "/api/news";

export const newsApi = async (selected: string) => {
  let result: TNewsData[] = [];
  try {
    const { data } = await axios.post(NEWS_API_URL, {
      country: selected,
    });
    data.forEach((d: any) => {
      const title = d.title;
      const source = d.source;
      const date = d.date;
      const link = d.link;
      result.push({ title, source, date, link });
    });
    return result;
  } catch {
    return null;
  }
};
