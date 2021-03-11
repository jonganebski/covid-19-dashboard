import { useEffect, useState } from "react";
import { DailyData } from "../types";

// ------------- CONSTANT -------------

const initialViewport: TViewport = {
  lat: 20,
  lng: 10,
  zoom: 2,
};

type TViewport = {
  lat: number;
  lng: number;
  zoom: number;
};

// export const useViewPort = (
//   selectedCountry: string,
//   countryData: DailyData[] | null
// ): [TViewport, React.Dispatch<React.SetStateAction<TViewport>>] => {
//   const [viewport, setViewport] = useState<TViewport>(initialViewport);

//   useEffect(() => {
//     if (!selectedCountry) {
//       setViewport(initialViewport);
//     } else {
//       const countryD = countryData?.find((D) => D.country === selectedCountry);
//       const lat = countryD?.lat;
//       const lng = countryD?.lon;
//       const zoom = selectedCountry === "Russia" ? 3 : 4;
//       if (lat && lng) {
//         setViewport({ lat, lng, zoom });
//       } else {
//         setViewport(initialViewport);
//       }
//     }
//   }, [selectedCountry, countryData]);

//   return [viewport, setViewport];
// };
