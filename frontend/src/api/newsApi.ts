import axios from "axios";
import { TNewsData } from "../types";

export const newsApi = async (selected: string) => {
  let result: TNewsData[] = [];
  const { data } = await axios.post("http://localhost:4000", {
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
};
