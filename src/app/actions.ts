"use server";

// import { regionCodes } from "@/regionCodes";
import flattenedRegionCodes from "@/flattenedRegionCodes.json";
import Fuse from "fuse.js";

export type Region = {
  name: string;
  code: string;
};
export type RegionTree = Array<{
  code: string;
  name: string;
  subnational1?: Array<{
    code: string;
    name: string;
    subnational2?: Array<{
      code: string;
      name: string;
    }>;
  }>;
}>;
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
const fuse = new Fuse<FlattenedRegion>(flattenedRegionCodes, fuseOptions);

export async function findAllRegions(query: string) {
  const regions = fuse.search(query);
  if (!regions || regions.length === 0) {
    throw new Error(`Could not find any regions matching ${query}`);
  }
  return regions.slice(0, 10);
}
