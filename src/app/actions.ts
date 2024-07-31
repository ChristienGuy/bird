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

function findAllRegionsByQuery(query: string): Region[] | undefined {
  const queryLower = query.toLowerCase();
  // If we don't have a query return the first 10 regions
  // This mimics "pagination" of the regions without actually needing to
  // implement pagination
  if (!query) {
    return regionCodes.slice(0, 10).map((region) => ({
      name: region.name,
      code: region.code,
    }));
  }

  const results: Region[] = [];
  for (const region of regionCodes) {
    if (region.name.toLowerCase().includes(queryLower)) {
      results.push({ name: region.name, code: region.code });
    }

    if (region.subnational1) {
      for (const sub1 of region.subnational1) {
        if (sub1.name.toLowerCase().includes(queryLower)) {
          results.push({
            name: `${sub1.name}, ${region.name}`,
            code: sub1.code,
          });
        }

        if (sub1.subnational2) {
          for (const sub2 of sub1.subnational2) {
            if (sub2.name.toLowerCase().includes(queryLower)) {
              results.push({
                name: `${sub2.name}, ${sub1.name}, ${region.name}`,
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
