"use server";

import { regionCodes } from "@/regionCodes";

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

// Search through the regionCodes array and subnational1 and subnational2 arrays
// find where the region name includes the query
// Add that region code to the result array
// return the result array
function findAllRegionsByQuery(query: string): Region[] | undefined {
  const queryLower = query.toLowerCase();
  const results: Region[] = [];
  for (const region of regionCodes) {
    if (region.name.toLowerCase().includes(queryLower)) {
      results.push({ name: region.name, code: region.code });
    }

    if (region.subnational1) {
      for (const sub1 of region.subnational1) {
        if (sub1.name.toLowerCase().includes(queryLower)) {
          results.push({ name: sub1.name, code: sub1.code });
        }

        if (sub1.subnational2) {
          for (const sub2 of sub1.subnational2) {
            if (sub2.name.toLowerCase().includes(queryLower)) {
              results.push({ name: sub2.name, code: sub2.code });
            }
          }
        }
      }
    }
  }

  return results;
}

// Recursively search through the regionCodes array
// to find the region code where the query matches the region name
function recursivelyFindRegionByQuery(
  query: string,
  list: RegionTree = regionCodes
): Region | undefined {
  const queryLower = query.toLowerCase();
  for (const region of list) {
    if (region.name.toLowerCase().includes(queryLower)) {
      return { name: region.name, code: region.code };
    }

    if (region.subnational1) {
      const subnational1RegionCode = recursivelyFindRegionByQuery(
        queryLower,
        region.subnational1
      );
      if (subnational1RegionCode) {
        return subnational1RegionCode;
      }

      for (const sub1 of region.subnational1) {
        if (sub1.subnational2) {
          const subnational2RegionCode = recursivelyFindRegionByQuery(
            queryLower,
            sub1.subnational2
          );
          if (subnational2RegionCode) {
            return subnational2RegionCode;
          }
        }
      }
    }
  }
}

export async function findRegion(query: string): Promise<Region> {
  const regionCode = recursivelyFindRegionByQuery(query);
  if (!regionCode) {
    throw new Error(`Could not find region code for ${query}`);
  }
  return regionCode;
}

export async function findAllRegions(query: string): Promise<Region[]> {
  const regions = findAllRegionsByQuery(query);
  if (!regions || regions.length === 0) {
    throw new Error(`Could not find any regions matching ${query}`);
  }
  return regions;
}
