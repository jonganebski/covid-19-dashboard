import Axios from "axios";
import { useEffect, useState } from "react";
import { DAILY_BASE_URL } from "../constants";

export const useTargetUrls = (): [string, string] => {
  const [targetUrls, setTargetUrls] = useState<string[]>([]);

  useEffect(() => {
    const getFileNames = () => {
      const today = new Date();
      let files: string[] = [];
      for (let i = 0; i < 7; i++) {
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, "0");
        const date = today.getDate().toString().padStart(2, "0");
        const fileName = `${month}-${date}-${year}.csv`;
        files.push(fileName);
        today.setDate(today.getDate() - 1);
      }
      return files;
    };
    const getTargetUrls = async () => {
      console.log(process.env.NODE_ENV);
      if (process.env.NODE_ENV === "development") {
        setTargetUrls(["10-31-2020.csv", "10-30-2020.csv"]);
        return;
      }
      const files = getFileNames();
      let targets: string[] = [];
      for (const file of files) {
        try {
          const url = DAILY_BASE_URL + file;
          const res = await Axios.get(url);
          const status = res.status;
          if (status === 200) {
            targets.push(url);
          }
          const isNotContinuous = status !== 200 && targets.length !== 0;
          if (isNotContinuous) {
            throw new Error("CSV data is not provided correctly.");
          }
        } catch {
          // csv files are not found. handle this error.
        }
        if (targets.length === 2) {
          break;
        }
      }
      setTargetUrls(targets);
    };
    getTargetUrls();
  }, []);
  return [targetUrls[0], targetUrls[1]];
};
