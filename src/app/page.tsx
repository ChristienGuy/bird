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
  const response = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages|pageprops&format=json&piprop=thumbnail&titles=${speciesName}&pithumbsize=300&redirects`
  );

  console.log(`fetching image for ${speciesName}`);

  return response.json();
};

async function BirdCard({ sighting }: { sighting: Sighting }) {
  const birdImage = await getBirdImage(sighting.comName);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{sighting.comName}</CardTitle>
        <CardDescription>{sighting.sciName}</CardDescription>
      </CardHeader>
      <CardContent>
        <Image
          src={
            birdImage.query.pages[Object.keys(birdImage.query.pages)[0]]
              ?.thumbnail?.source
          }
          alt={sighting.comName}
          width={300}
          height={300}
        />
        <p>Location: {sighting.locName}</p>
        <p>Observed: {sighting.obsDt}</p>
        <p>Number of birds: {sighting.howMany}</p>
      </CardContent>
    </Card>
  );
}

export default async function Home() {
  const sightings = await getRecentSightings(UK_REGION_CODE);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl mb-12">
        Recent bird sightings in the UK{" "}
        <span role="img" aria-label="bird">
          🐦
        </span>
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sightings.map((sighting) => (
          <BirdCard key={sighting.subId} sighting={sighting} />
        ))}
      </div>
    </main>
  );
}
