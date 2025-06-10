"use server";

import speciesData from "@/species.json";
import flattenedRegionCodes from "@/flattenedRegionCodes.json";
import Fuse from "fuse.js";
import { EBIRD_BASE_API_URL } from "@/constants";
import { getRandomArbitrary } from "@/lib/utils";

/*
 * REGION ACTIONS
 */
export type Region = {
  code: string;
  name: string;
  type: "country" | "subnational1" | "subnational2";
  country: string;
  subnational1: string | null;
  subnational2: string | null;
  fullHierarchyName: string;
};

export async function getRegion(regionCode: string) {
  // We're reassigning the imported flattenedRegionCodes to a new variable
  // here exclusively so that we can cast it to a Region[] type and get
  // good type checking in the rest of the function.
  const regions = flattenedRegionCodes as Region[];

  const region = regions.find((region) => region.code === regionCode);

  if (!region) {
    throw new Error(`Could not find region with code ${regionCode}`);
  }

  return region;
}

export type FindRegionsResponse = {
  item: Region;
};

const regionsFuseIndex = new Fuse<Region>(flattenedRegionCodes, {
  includeScore: true,
  keys: ["name"],
});

export async function findRegions(
  query: string,
): Promise<FindRegionsResponse[]> {
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

/**
 * NEARBY SIGHTINGS ACTIONS
 */
export type Sighting = {
  speciesCode: string;
  comName: string;
  sciName: string;
  locId: string;
  locName: string;
  obsDt: string;
  howMany: number;
  lat: number;
  lng: number;
  obsValid: boolean;
  obsReviewed: boolean;
  locationPrivate: boolean;
};
export type NearbySightingsGetResponse = Array<Sighting>;
export async function getNearbySightings({
  latitude,
  longitude,
  distance,
}: {
  latitude: number;
  longitude: number;
  distance: number;
}) {
  if (!process.env.EBIRD_API_TOKEN) {
    throw new Error("Missing eBird API token");
  }

  const url = `${EBIRD_BASE_API_URL}/data/obs/geo/recent`;

  const searchParams = new URLSearchParams({
    lat: latitude.toFixed(2),
    lng: longitude.toFixed(2),
    maxResults: "10",
    dist: distance.toString(),
  });

  const headers = new Headers();
  headers.append("X-eBirdApiToken", process.env.EBIRD_API_TOKEN);
  headers.append(
    "Api-User-Agent",
    "bird-sightings/0.1 (christien.guy@gmail.com)",
  );

  const response = await fetch(`${url}?${searchParams.toString()}`, {
    headers,
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch nearby sightings: ${response.statusText}`);
  }

  const json: NearbySightingsGetResponse = await response.json();

  return json;
}

/*
 * NEARBY HOTSPOTS
 */
type Hotspot = {
  locId: string;
  locName: string;
  countryCode: string;
  subnational1Code: string;
  subnational2Code: string;
  lat: number;
  lng: number;
  latestObsDt: string;
  numSpeciesAllTime: number;
};
export async function getNearbyHotspots(latitude: number, longitude: number) {
  if (!process.env.EBIRD_API_TOKEN) {
    throw new Error("Missing eBird API token");
  }

  const url = `${EBIRD_BASE_API_URL}/ref/hotspot/geo`;

  const searchParams = new URLSearchParams({
    lat: latitude.toFixed(2),
    lng: longitude.toFixed(2),
    fmt: "json",
    back: "4", // Hotspots visited up to this many days ago
  });

  const headers = new Headers();
  headers.append("X-eBirdApiToken", process.env.EBIRD_API_TOKEN);
  headers.append(
    "Api-User-Agent",
    "bird-sightings/0.1 (christien.guy@gmail.com)",
  );

  const response = await fetch(`${url}?${searchParams.toString()}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch nearby hotspots: ${response.statusText}`);
  }

  const json: Hotspot[] = await response.json();

  return json;
}

/**
 * GET RECENT NOTABLE OBSERVATION
 */
type NotableObservation = {
  speciesCode: string;
  comName: string;
  sciName: string;
  locId: string;
  locName: string;
  obsDt: string;
  howMany: number;
  lat: number;
  lng: number;
  obsValid: boolean;
  obsReviewed: boolean;
  locationPrivate: boolean;
  subId: string;
  exoticCategory: string;
  subnational2Code: string;
  subnational2Name: string;
  subnational1Code: string;
  subnational1Name: string;
  countryCode: string;
  countryName: string;
  userDisplayName: string;
  obsId: string;
  checklistId: string;
  presenceNoted: boolean;
  hasComments: boolean;
  evidence: string;
  hasRichMedia: true;
  firstName: string;
  lastName: string;
};
export async function getRecentNotableObservation(regionCode: string) {
  if (!process.env.EBIRD_API_TOKEN) {
    throw new Error("Missing eBird API token");
  }

  const url = `${EBIRD_BASE_API_URL}/data/obs/${regionCode}/recent/notable`;

  const searchParams = new URLSearchParams({
    detail: "full",
    back: "4", // Hotspots visited up to this many days ago
    hotspot: "true",
    maxResults: "10",
  });

  const headers = new Headers();
  headers.append("X-eBirdApiToken", process.env.EBIRD_API_TOKEN);
  headers.append(
    "Api-User-Agent",
    "bird-sightings/0.1 (christien.guy@gmail.com)",
  );

  const response = await fetch(`${url}?${searchParams.toString()}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch nearby hotspots: ${response.statusText}`);
  }
  const json: NotableObservation[] = await response.json();

  return json;
}

// Combines the utility of the getNearbyHotspots & getRecentNotableObservations functions
// Returns the recent notable observations based on the coordinates supplied to find nearby hotspots
export const getRecentNearbyNotableBird = async (
  latitude: number,
  longitude: number,
) => {
  const nearbyHotspots = await getNearbyHotspots(latitude, longitude);
  const randomHotspot =
    nearbyHotspots[getRandomArbitrary(0, nearbyHotspots.length)];
  const recentNotableObservations = await getRecentNotableObservation(
    randomHotspot.subnational2Code,
  );
  return recentNotableObservations;
};

/**
 * WIKIPEDIA FETCH
 */
export type BirdImageResponse = {
  query: {
    pages: {
      [key: string]: {
        pageid: number;
        ns: number;
        title: string;
        thumbnail: {
          source: string;
          width: number;
          height: number;
        };
        pageprops: {
          displaytitle: string;
          defaultsort: string;
        };
      };
    };
  };
};

export async function getBirdImage(
  speciesName: string,
): Promise<BirdImageResponse> {
  const wikiUrl = `https://en.wikipedia.org/w/api.php`;

  const params = new URLSearchParams({
    action: "query",
    prop: "pageimages|pageprops",
    format: "json",
    piprop: "thumbnail",
    titles: speciesName,
    pithumbsize: "500",
    redirects: "",
  });

  const headers = new Headers();
  headers.append(
    "Api-User-Agent",
    "bird-sightings/0.1 (christien.guy@gmail.com)",
  );

  const response = await fetch(`${wikiUrl}?${params.toString()}`, {
    headers,
    next: {
      revalidate: 60 * 60 * 24, // 24 hours,
    },
  });

  return response.json();
}
