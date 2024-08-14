"use server";

import speciesData from "@/species.json";
import flattenedRegionCodes from "@/flattenedRegionCodes.json";
import Fuse from "fuse.js";

/*
 * REGION SEARCH ACTIONS
 */
export async function getRegion(regionCode: string): Promise<Region> {
  const region = flattenedRegionCodes.find((r) => r.code === regionCode);
  if (!region) {
    throw new Error(`Could not find region with code ${regionCode}`);
  }
  return region;
}

export type Region = {
  code: string;
  name: string;
  type: string;
  country: string;
  subnational1: string | null;
  subnational2: string | null;
  fullHierarchyName: string;
};

export type RegionGetResponse = {
  item: Region;
};

const regionsFuseIndex = new Fuse<Region>(flattenedRegionCodes, {
  includeScore: true,
  keys: ["name"],
});

export async function findMatchingRegions(
  query: string,
): Promise<RegionGetResponse[]> {
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
