import { regionCodes } from "./regionCodes";

type FlatRegion = {
  code: string;
  name: string;
  type: "country" | "subnational1" | "subnational2";
  country: string;
  subnational1: string | null;
  subnational2: string | null;
  fullHierarchyName: string;
};

export const getFlattenedRegionCodes = () => {
  const flattenedData: FlatRegion[] = [];
  regionCodes.forEach((country) => {
    flattenedData.push({
      name: country.name,
      code: country.code,
      country: country.name,
      type: "country",
      subnational1: null,
      subnational2: null,
      fullHierarchyName: country.name,
    });

    if (country.subnational1) {
      country.subnational1.forEach((sub1) => {
        flattenedData.push({
          name: sub1.name,
          code: sub1.code,
          country: country.name,
          type: "subnational1",
          subnational1: sub1.name,
          subnational2: null,
          fullHierarchyName: `${sub1.name}, ${country.name}`,
        });

        if (sub1.subnational2) {
          sub1.subnational2.forEach((sub2) => {
            flattenedData.push({
              name: sub2.name,
              code: sub2.code,
              country: country.name,
              type: "subnational2",
              subnational1: sub1.name,
              subnational2: sub2.name,
              fullHierarchyName: `${sub2.name}, ${sub1.name}, ${country.name}`,
            });
          });
        }
      });
    }
  });

  return flattenedData;
};
