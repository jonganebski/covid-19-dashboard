export class DateAndCount {
  public date: number;
  public count: number;
  constructor(date: number, count: number) {
    this.date = date;
    this.count = count;
  }
}

export class CountryTimeData {
  public country: string;
  public data: DateAndCount[];
  constructor(country: string, data: DateAndCount[]) {
    this.country = country;
    this.data = data;
  }
}

export class CountryAndCount {
  public country: string;
  public count: number | null;
  constructor(country: string, count: number | null) {
    this.country = country;
    this.count = count;
  }
}

export class DailyData {
  public country: string;
  public combinedKey: string;
  public lastUpdate: string;
  public newCasesLastUpdate: string;
  public active: number | null;
  public confirmed: number | null;
  public deaths: number | null;
  public recovered: number | null;
  public newCases: number | null;
  public lat: number | null;
  public lon: number | null;
  public province: string;
  public admin2: string;
  public newCaseRate: number;
  constructor(
    country: string,
    combinedKey: string,
    lastUpdate: string,
    newCasesLastUpdate: string,
    active: number | null,
    confirmed: number | null,
    deaths: number | null,
    recovered: number | null,
    newCases: number | null,
    lat: number | null,
    lon: number | null,
    province: string,
    admin2: string,
    newCaseRate: number
  ) {
    this.country = country;
    this.combinedKey = combinedKey;
    this.lastUpdate = lastUpdate;
    this.newCasesLastUpdate = newCasesLastUpdate;
    this.active = active;
    this.confirmed = confirmed;
    this.deaths = deaths;
    this.recovered = recovered;
    this.newCases = newCases;
    this.lat = lat;
    this.lon = lon;
    this.province = province;
    this.admin2 = admin2;
    this.newCaseRate = newCaseRate;
  }
}

export class ReferenceData {
  public country: string;
  public province: string;
  public admin2: string;
  public lat: number | null;
  public lon: number | null;
  public population: number | null;
  public UID: number | null;
  public iso2: string;
  constructor(
    country: string,
    province: string,
    admin2: string,
    lat: number | null,
    lon: number | null,
    population: number | null,
    UID: number | null,
    iso2: string
  ) {
    this.country = country;
    this.province = province;
    this.admin2 = admin2;
    this.lat = lat;
    this.lon = lon;
    this.population = population;
    this.UID = UID;
    this.iso2 = iso2;
  }
}

export class NewsData {
  public title: string;
  public source: string;
  public date: string;
  public link: string;
  constructor(title: string, source: string, date: string, link: string) {
    this.title = title;
    this.source = source;
    this.date = date;
    this.link = link;
  }
}

export class Coord {
  public x: number;
  public y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class Rate {
  public country: string;
  public rate: number;
  constructor(country: string, rate: number) {
    this.country = country;
    this.rate = rate;
  }
}

export type TTab = "active" | "deaths" | "recovered" | "new cases";

export type TChartTab = "confirmed" | "deaths" | "daily cases" | "daily deaths";
