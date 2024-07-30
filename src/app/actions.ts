"use server";

import { regionCodes } from "@/regionCodes";

type RegionCode = {
  name: string;
  code: string;
};
type RegionCodes = Array<{
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

// Recursively search through the regionCodes array
// to find the region code where the query matches the region name
function recursivelyFindRegionCodeByQuery(
  query: string,
  list: RegionCodes = regionCodes
): RegionCode | undefined {
  const queryLower = query.toLowerCase();
  for (const region of list) {
    if (region.name.toLowerCase().includes(queryLower)) {
      return { name: region.name, code: region.code };
    }

    if (region.subnational1) {
      const subnational1RegionCode = recursivelyFindRegionCodeByQuery(
        queryLower,
        region.subnational1
      );
      if (subnational1RegionCode) {
        return subnational1RegionCode;
      }

      for (const sub1 of region.subnational1) {
        if (sub1.subnational2) {
          const subnational2RegionCode = recursivelyFindRegionCodeByQuery(
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

export async function findRegionCode(query: string): Promise<RegionCode> {
  const regionCode = recursivelyFindRegionCodeByQuery(query);
  if (!regionCode) {
    throw new Error(`Could not find region code for ${query}`);
  }
  return regionCode;
}
