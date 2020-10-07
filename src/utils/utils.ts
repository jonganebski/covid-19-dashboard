export const getMonthName = (i: number) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[i];
};

export const changeBg = (selected: string, countryName: string) =>
  selected === countryName ? "black" : "none";
