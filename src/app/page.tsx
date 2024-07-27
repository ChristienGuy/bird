import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/Card";

const UK_REGION_CODE = "GB";
const EBIRD_BASE_API_URL = "https://api.ebird.org/v2";

type RecentSightingsResponse = Array<{
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
}>;

type Sighting = RecentSightingsResponse[0];

const getRecentSightings = async (
  regionCode: string
): Promise<RecentSightingsResponse> => {
  const response = await fetch(
    `${EBIRD_BASE_API_URL}/data/obs/${regionCode}/recent`,
    {
      headers: {
        "X-eBirdApiToken": process.env.EBIRD_API_TOKEN ?? "",
      },
    }
  );

  console.log(`fetching recent sightings for ${regionCode}`);

  return response.json();
};

const getBirdImage = async (
  speciesName: string
): Promise<{
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
}> => {
  const params = new URLSearchParams({
    action: "query",
    prop: "pageimages|pageprops",
    format: "json",
    piprop: "thumbnail",
    titles: speciesName,
    pithumbsize: "500",
    redirects: "",
  });

  const url = `https://en.wikipedia.org/w/api.php?${params.toString()}`;
  const response = await fetch(url, {
    headers: {
      "Api-User-Agent": "bird-sightings/0.1 (christien.guy@gmail.com)",
    },
  });

  console.log(`fetching image for ${speciesName}`, url);

  return response.json();
};

async function BirdCard({ sighting }: { sighting: Sighting }) {
  const birdImage = await getBirdImage(sighting.sciName);

  const observationDate = new Date(sighting.obsDt);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{sighting.comName}</CardTitle>
        <CardDescription>{sighting.sciName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-72">
          <Image
            className="object-cover"
            src={
              birdImage.query.pages[Object.keys(birdImage.query.pages)[0]]
                ?.thumbnail?.source
            }
            alt={sighting.comName}
            fill
          />
        </div>
        <div className="flex flex-col gap-2">
          <p>{sighting.locName}</p>
          <p>
            {new Intl.DateTimeFormat("en-GB", {
              dateStyle: "full",
              timeStyle: "short",
            }).format(observationDate)}
          </p>
          <p>Number of birds: {sighting.howMany}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function Home() {
  const sightings = await getRecentSightings(UK_REGION_CODE);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <h1 className="text-4xl mb-12">
        Recent bird sightings in the UK{" "}
        <span role="img" aria-label="bird">
          🐦
        </span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sightings.map((sighting) => (
          <BirdCard key={sighting.subId} sighting={sighting} />
        ))}
      </div>
    </main>
  );
}
