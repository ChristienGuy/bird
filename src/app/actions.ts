"use server";

import speciesData from "@/species.json";
import flattenedRegionCodes from "@/flattenedRegionCodes.json";
import Fuse from "fuse.js";

/*
 * REGION ACTIONS
 */
export type Region = {
  code: string;
  name: string;
  type: "country" | "subnational1" | "subnational2";
  country: string;
  subnational1: string | null;
  subnational2: string | null;
  fullHierarchyName: string;
};

export async function getRegion(regionCode: string) {
  // We're reassigning the imported flattenedRegionCodes to a new variable
  // here exclusively so that we can cast it to a Region[] type and get
  // good type checking in the rest of the function.
  const regions = flattenedRegionCodes as Region[];

  const region = regions.find((region) => region.code === regionCode);

  if (!region) {
    throw new Error(`Could not find region with code ${regionCode}`);
  }

  return region;
}

export type FindRegionsResponse = {
  item: Region;
};

const regionsFuseIndex = new Fuse<Region>(flattenedRegionCodes, {
  includeScore: true,
  keys: ["name"],
});

export async function findRegions(
  query: string,
): Promise<FindRegionsResponse[]> {
  const regions = regionsFuseIndex.search(query);
  if (!regions || regions.length === 0) {
    throw new Error(`Could not find any regions matching ${query}`);
  }
  return regions.slice(0, 10);
}

/*
 * SPECIES SEARCH ACTIONS
 */
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
