"use server";

import { regionCodes } from "@/regionCodes";
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

const topLevelFuseOptions = {
  includeScore: true,
  keys: ["name"],
};
const fuse = new Fuse(regionCodes, topLevelFuseOptions);

function findAllRegionsByQuery(query: string): Region[] | undefined {
  const queryLower = query.toLowerCase();
  const results: Region[] = [];

  for (const region of fuse.search(query)) {
    // if (region.item.name.toLowerCase().includes(queryLower)) {
    results.push({ name: region.item.name, code: region.item.code });
    // }

    if (region.item.subnational1) {
      for (const sub1 of region.item.subnational1) {
        // removing the if statement here means that any country that matches the query will return all of its sub1 items.

        if (sub1.name.toLowerCase().includes(queryLower)) {
          results.push({
            name: `${sub1.name}, ${region.item.name}`,
            code: sub1.code,
          });
        }

        if (sub1.subnational2) {
          for (const sub2 of sub1.subnational2) {
            if (sub2.name.toLowerCase().includes(queryLower)) {
              results.push({
                name: `${sub2.name}, ${sub1.name}, ${region.item.name}`,
                code: sub2.code,
              });
            }
          }
        }
      }
    }
  }

  return results;
}

export async function findAllRegions(query: string): Promise<Region[]> {
  const regions = findAllRegionsByQuery(query);
  if (!regions || regions.length === 0) {
    throw new Error(`Could not find any regions matching ${query}`);
  }
  return regions;
}
