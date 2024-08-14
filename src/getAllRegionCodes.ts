import { Region } from "./app/actions";
import { EBIRD_BASE_API_URL } from "./constants";

const getCountries = async (): Promise<
  Array<{
    name: string;
    code: string;
  }>
> => {
  if (!process.env.EBIRD_API_TOKEN) {
    throw new Error("Missing eBird API token");
  }

  const url = `${EBIRD_BASE_API_URL}/ref/region/list/country/world`;
  const headers = new Headers({
    "X-eBirdApiToken": process.env.EBIRD_API_TOKEN,
    "Api-User-Agent": "bird-sightings/0.1 (christien.guy@gmail.com)",
  });
  const response = await fetch(url, {
    headers,
  });

  return response.json();
};

async function getSubnational1(region: string): Promise<
  Array<{
    name: string;
    code: string;
  }>
> {
  if (!process.env.EBIRD_API_TOKEN) {
    throw new Error("Missing eBird API token");
  }

  const url = `${EBIRD_BASE_API_URL}/ref/region/list/subnational1/${region}`;
  const headers = new Headers({
    "X-eBirdApiToken": process.env.EBIRD_API_TOKEN,
    "Api-User-Agent": "bird-sightings/0.1 (christien.guy@gmail.com)",
  });
  const response = await fetch(url, {
    headers,
  });

  return response.json();
}

async function getSubNational2(region: string): Promise<
  Array<{
    name: string;
    code: string;
  }>
> {
  if (!process.env.EBIRD_API_TOKEN) {
    throw new Error("Missing eBird API token");
  }

  const url = `${EBIRD_BASE_API_URL}/ref/region/list/subnational2/${region}`;
  const headers = new Headers({
    "X-eBirdApiToken": process.env.EBIRD_API_TOKEN,
    "Api-User-Agent": "bird-sightings/0.1 (christien.guy@gmail.com)",
  });
  const response = await fetch(url, {
    headers,
  });
  return response.json();
}

export async function getNestedRegionsData(): Promise<Array<Region>> {
  const countries = await getCountries();
  const countriesWithSubnationals = await Promise.all(
    countries.map(async (country) => {
      const subnational1 = await getSubnational1(country.code);
      const subnational2 = await getSubNational2(country.code);

      return {
        name: country.name,
        code: country.code,
        subnational1: subnational1.map((sub1) => {
          const sub2s = subnational2.filter((sub2) => {
            const parentCode = sub2.code.split("-").slice(0, -1).join("-");
            return sub1.code === parentCode;
          });
          return {
            ...sub1,
            subnational2: sub2s,
          };
        }),
      };
    }),
  );

  return countriesWithSubnationals;
}
