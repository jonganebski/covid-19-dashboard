import axios from "axios";
import { useEffect, useState } from "react";
import { TNewsData } from "../types";

const NEWS_API_URL =
  (process.env.NODE_ENV === "development" &&
    "http://localhost:4000/api/news") ||
  "/api/news";

export const useNewsData = (
  selectedCountry: string
): [boolean, string, TNewsData[] | null] => {
  const [isNewsLoading, setIsNewsLoading] = useState(true);
  const [error, setError] = useState("");
  const [newsData, setNewsData] = useState<TNewsData[] | null>(null);

  useEffect(() => {
    setIsNewsLoading(true);
    let result: TNewsData[] = [];

    axios
      .post(NEWS_API_URL, { country: selectedCountry })
      .then(({ data }) => {
        data.forEach((d: any) => {
          const title = d.title;
          const source = d.source;
          const date = d.date;
          const link = d.link;
          result.push({ title, source, date, link });
        });
        setNewsData(result);
      })
      .catch(() => setError("Failed to get News Data."))
      .finally(() => setIsNewsLoading(false));
  }, [selectedCountry]);

  return [isNewsLoading, error, newsData];
};
