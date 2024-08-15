import { EBIRD_BASE_API_URL } from "@/constants";
import { Map } from "@/app/components/map";
import { ViewController } from "./view-controller";
import { CardView } from "./card-view";

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
  subId: string;
};
type RecentSightingsResponse = Array<Sighting>;

const getRecentSightings = async (
  regionCode: string,
): Promise<RecentSightingsResponse> => {
  if (!process.env.EBIRD_API_TOKEN) {
    throw new Error("Missing eBird API token");
  }

  const url = `${EBIRD_BASE_API_URL}/data/obs/${regionCode}/recent`;

  const searchParams = new URLSearchParams({
    maxResults: "20",
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

  return response.json();
};

export default async function RecentSightingsPage({
  params,
  searchParams,
}: {
  params: {
    regionCodeSlug: string[];
  };
  searchParams: { name: string };
}) {
  // TODO: make a function that finds a RegionCode by regionCodeSlug
  // So that we can show the region name at the top of the page
  const regionCode = params.regionCodeSlug.join("-").toUpperCase();
  const sightings = await getRecentSightings(regionCode);

  return (
    <div className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <h1 className="mb-12 text-4xl">
        Recent bird sightings in {searchParams.name}{" "}
        <span role="img" aria-label="bird">
          🐦
        </span>
      </h1>
      <ViewController
        cardView={<CardView sightings={sightings} />}
        mapView={<Map />}
      />
    </div>
  );
}
