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

function jitterCoordinate(coordinate: number) {
  return coordinate + (Math.random() / 500) * (Math.random() > 0.5 ? 1 : -1);
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
      nearbySightings.map((sighting) => ({
        ...sighting,
        lat: jitterCoordinate(sighting.lat),
        lng: jitterCoordinate(sighting.lng),
      })),
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
        {nearbySightings?.map((sighting) => (
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
