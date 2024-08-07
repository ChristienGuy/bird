"use server";

import speciesData from "@/species.json";
import flattenedRegionCodes from "@/flattenedRegionCodes.json";
import Fuse from "fuse.js";

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

const speciesFuseIndex = new Fuse<Species>(speciesData, {
  keys: ["comName"],
  ignoreLocation: true,
});
export async function findSpecies(query: string) {
  return speciesFuseIndex.search(query).slice(0, 10);
}
