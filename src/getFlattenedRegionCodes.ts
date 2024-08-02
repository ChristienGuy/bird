import { RegionTree } from "./app/actions";

type FlatRegion = {
  code: string;
  name: string;
  type: string;
  country: string;
  subnational1: string | null;
  subnational2: string | null;
  fullHierarchyName: string;
};

type Region = {
  code: string;
  name: string;
  subnational1: Array<object> | undefined;
  subnational2: Array<object> | undefined;
};

export const getFlattenedRegionCodes = (nestedData: RegionTree) => {
  const flattenedData: FlatRegion[] = [];

  function flattenNestedRegions(
    region: Region,
    country: string,
    subdivision1: string | null = null,
    subdivision2: string | null = null
  ) {
    const { code, name, subnational1, subnational2 } = region;

    let type = "country";
    if (subnational1 !== undefined && subnational2 === undefined) {
      country = name;
    } else if (subnational1 === undefined && subnational2 !== undefined) {
      type = "subnational1";
      subdivision1 = name;
    } else if (subnational1 === undefined && subnational2 === undefined) {
      type = "subnational2";
      subdivision2 = name;
    }

    const fullHierarchyName = [subdivision2, subdivision1, country]
      .filter(Boolean)
      .join(", ");

    flattenedData.push({
      code,
      name,
      type,
      country,
      subnational1: subdivision1,
      subnational2: subdivision2,
      fullHierarchyName: type !== "country" ? fullHierarchyName : name,
    });

    if (subnational1) {
      subnational1.forEach((sub1) =>
        flattenNestedRegions(sub1, country, subdivision1)
      );
    } else if (subnational2) {
      subnational2.forEach((sub2) =>
        flattenNestedRegions(sub2, country, subdivision1, subdivision2)
      );
    }
  }
  nestedData.forEach((region) => flattenNestedRegions(region));
  return flattenedData;
};
