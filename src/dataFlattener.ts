// Needs typing (I originally wrote this in javascript)

export const dataFlattener = (nestedData) => {
  type flatData = {
    code: string;
    name: string;
    type: string;
    country: string;
    subnational1: string | null;
    subnational2: string | null;
    fullHierarchyName: string;
  };

  type region = {
    code: string;
    name: string;
    subnational1: string | undefined;
    subnational2: string | undefined;
  };

  const flattenedData: flatData[] = [];

  function recurse(
    region: region,
    country: string,
    subdivision1 = null,
    subdivision2 = null
  ) {
    const { code, name, subnational1, subnational2 } = region;

    let type = "country";
    if (subnational1 !== undefined && subnational2 === undefined) {
      country = name;
    } else if (subnational1 === undefined && subnational2 !== undefined) {
      type = "subdivision1";
      subdivision1 = name;
    } else if (subnational1 === undefined && subnational2 === undefined) {
      type = "subdivision2";
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
      subnational1.forEach((sub1) => recurse(sub1, country, subdivision1));
    } else if (subnational2) {
      subnational2.forEach((sub2) =>
        recurse(sub2, country, subdivision1, subdivision2)
      );
    }
  }
  nestedData.forEach((region) => recurse(region));
  return flattenedData;
};
