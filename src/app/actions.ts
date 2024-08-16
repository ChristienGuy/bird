"use server";

import speciesData from "@/species.json";
import flattenedRegionCodes from "@/flattenedRegionCodes.json";
import Fuse, { FuseResult } from "fuse.js";
import { EBIRD_BASE_API_URL } from "@/constants";

export type Region = {
  name: string;
  code: string;
};

export type FlattenedRegion = {
  code: string;
  name: string;
  type: string;
  country: string;
  subnational1: string | null;
  subnational2: string | null;
  fullHierarchyName: string;
};

const fuseOptions = {
  includeScore: true,
  keys: ["name"],
};
const regionsFuseIndex = new Fuse<FlattenedRegion>(
  flattenedRegionCodes,
  fuseOptions,
);

export async function findMatchingRegions(query: string) {
  const regions = regionsFuseIndex.search(query);
  if (!regions || regions.length === 0) {
    throw new Error(`Could not find any regions matching ${query}`);
  }
  return regions.slice(0, 10);
}

export type Species = {
  sciName: string;
  comName: string;
  speciesCode: string;
  category: string;
  taxonOrder: number;
  bandingCodes: string[];
  comNameCodes: string[];
  sciNameCodes: string[];
  order: string;
  familyCode: string;
  familyComName: string;
  familySciName: string;
};

export type SpeciesGetResponse = Array<{
  item: Species;
}>;

const speciesFuseIndex = new Fuse<Species>(speciesData as readonly Species[], {
  keys: ["comName"],
  ignoreLocation: true,
});
export async function findSpecies(query: string): Promise<SpeciesGetResponse> {
  return speciesFuseIndex.search(query).slice(0, 10);
}

export async function getNearbySightings(longitude: number, latitude: number) {
  if (!process.env.EBIRD_API_TOKEN) {
    throw new Error("Missing eBird API token");
  }

  const url = `${EBIRD_BASE_API_URL}/data/obs/geo/recent?lat=${latitude}&lng=${longitude}`;

  const headers = new Headers();
  headers.append("X-eBirdApiToken", process.env.EBIRD_API_TOKEN);
  headers.append(
    "Api-User-Agent",
    "bird-sightings/0.1 (christien.guy@gmail.com)",
  );

  const response = await fetch(url, {
    headers,
    redirect: "follow",
  });
  return response.json();
}
