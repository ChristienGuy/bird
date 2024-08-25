"use client";
import {
  getNearbySightings,
  NearbySightingsGetResponse,
  Sighting,
} from "@/app/actions";
import { useEffect, useRef, useState } from "react";
import { GeolocateControl, Marker } from "react-map-gl";

import { Map } from "@/app/components/map";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// TODO: explain 65 is lowest charCode and 122 is largest charCode
function normalise(number: number, min = 65, max = 122) {
  return (number - min) / (max - min);
}

function deterministicallyDistributeLatLng(
  sighting: Sighting,
  index: number,
  total = 10,
) {
  // Calculating the angle for the current slice
  // based on cutting the circle into {total} equal parts
  // and then multiplying by the index to get the angle
  const angle = (index / total) * Math.PI * 2;

  // We use the first two characters of the scientific name
  // to get a hard to predict but deterministic value
  // This gets us a value between 65 and 122 (charCodes for [A-Za-z])
  // Which we then normalise to a value between 0 and 1
  // We then multiply this by a small value to get a small distance offset
  // to later modify the lat/lng (very small numbers equate to 100s of meters)
  const latDistance = normalise(sighting.sciName.charCodeAt(1)) * 0.0025;
  const lngDistance = normalise(sighting.sciName.charCodeAt(2)) * 0.0025;

  // We then calculate the new lat/lng by offsetting the original lat/lng
  // using both the angle and the distance so that all the points
  // are distributed around the original point in a circle by "random" distances
  return {
    lat: sighting.lat + Math.sin(angle) * latDistance,
    lng: sighting.lng + Math.cos(angle) * lngDistance,
  };
}

function BirdCard({
  onClick,
  sighting,
  isSelected = false,
}: {
  onClick: () => void;
  sighting: Sighting;
  isSelected: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSelected && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [isSelected]);

  return (
    <Card
      ref={cardRef}
      onClick={onClick}
      className={cn("h-full whitespace-nowrap p-4", {
        "border-2 border-orange-400": isSelected,
      })}
    >
      <div className="text-base font-bold">{sighting.comName}</div>
      <div className="text-sm font-light text-gray-500">{sighting.sciName}</div>
    </Card>
  );
}

export function MapNearby({
  initialSightings,
}: {
  initialSightings: NearbySightingsGetResponse;
}) {
  const [nearbySightings, setNearbySightings] =
    useState<NearbySightingsGetResponse>(initialSightings);

  const [selectedSpeciesCode, setSelectedSpeciesCode] = useState<string | null>(
    initialSightings[0]?.speciesCode ?? null,
  );

  const handleMoveEnd = async (longitude: number, latitude: number) => {
    const nearbySightings = await getNearbySightings(longitude, latitude);

    setNearbySightings(
      nearbySightings.map((sighting, index) => {
        if (index === 0) return sighting;
        const { lat, lng } = deterministicallyDistributeLatLng(sighting, index);
        return {
          ...sighting,
          lat,
          lng,
        };
      }),
    );
  };

  return (
    <div className="relative h-full">
      <Map
        onMoveEnd={(event) => {
          handleMoveEnd(event.viewState.longitude, event.viewState.latitude);
        }}
        initialViewState={{
          longitude: -1.688074,
          latitude: 53.185335,
          zoom: 10,
        }}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <GeolocateControl />
        {nearbySightings?.map((sighting, index) => (
          <Marker
            key={sighting.speciesCode}
            latitude={sighting.lat}
            longitude={sighting.lng}
            onClick={() => {
              setSelectedSpeciesCode(sighting.speciesCode);
            }}
          >
            <div
              className={cn(
                "flex size-6 flex-col items-center justify-center rounded-full bg-white shadow-md",
                {
                  "border-2 border-orange-400":
                    selectedSpeciesCode === sighting.speciesCode,
                  "border-2 border-red-600": index === 0, // debug for scatter
                },
              )}
            >
              <div className="size-3 rounded-full bg-primary" />
            </div>
          </Marker>
        ))}
      </Map>
      <div className="absolute bottom-8 left-0 right-0">
        <ScrollArea className="pb-4">
          <ul className="grid grid-flow-col grid-rows-1 items-stretch gap-3 px-4">
            {nearbySightings?.map((sighting) => (
              <li key={sighting.speciesCode}>
                <BirdCard
                  onClick={() => setSelectedSpeciesCode(sighting.speciesCode)}
                  sighting={sighting}
                  isSelected={selectedSpeciesCode === sighting.speciesCode}
                />
              </li>
            ))}
          </ul>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
