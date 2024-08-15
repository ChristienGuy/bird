"use server";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Sighting } from "./page";

async function getBirdImage(speciesName: string): Promise<{
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
}> {
  const url = `https://en.wikipedia.org/w/api.php`;

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

  const response = await fetch(`${url}?${params.toString()}`, {
    headers,
    next: {
      revalidate: 60 * 60 * 24, // 24 hours,
    },
  });

  return response.json();
}

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
        <div className="relative h-72 w-full">
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
        <div className="flex flex-col gap-2 pt-2">
          <a
            // TODO: abstract this into an Anchor component to share styles
            className="font-medium text-primary underline underline-offset-2"
            href={`https://www.google.com/maps/@${sighting.lat},${sighting.lng},14z`}
          >
            {sighting.locName}
          </a>
          <p>
            {new Intl.DateTimeFormat("en-GB", {
              dateStyle: "full",
              timeStyle: "short",
            }).format(observationDate)}
          </p>
          {sighting.howMany && <p>Number of birds: {sighting.howMany}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export async function CardView({ sightings }: { sightings: Sighting[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {sightings.map((sighting) => (
        <BirdCard key={sighting.subId} sighting={sighting} />
      ))}
    </div>
  );
}
