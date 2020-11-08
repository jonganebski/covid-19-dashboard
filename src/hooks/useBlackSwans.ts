import { useEffect, useState } from "react";
import { DailyData } from "../types";

export const useBlackSwans = (provinceData: DailyData[] | null) => {
  const [blackSwans, setBlackSwans] = useState<Set<string> | null>(null);

  useEffect(() => {
    if (provinceData) {
      setBlackSwans(() => {
        const set = new Set<string>();
        provinceData.forEach((d, i, arr) => {
          if (0 < i && d.country === arr[i - 1].country) {
            set.add(d.country ?? "");
          }
        });
        return set;
      });
    }
  }, [provinceData]);

  return [blackSwans];
};
