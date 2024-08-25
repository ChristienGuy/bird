"use client";
import {
  getNearbySightings,
  NearbySightingsGetResponse,
  Sighting,
} from "@/app/actions";
import { useEffect, useRef, useState } from "react";
import { GeolocateControl, MapRef, Marker } from "react-map-gl";

import { Map } from "@/app/components/map";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  deterministicallyDistributeLatLng,
  getHaversineDistance,
} from "./nearby-map-util";

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
      <div className="text-orange-300">
        {sighting.lat}, {sighting.lng}
      </div>
    </Card>
  );
}

export function MapNearby({
  initialSightings,
}: {
  initialSightings: NearbySightingsGetResponse;
}) {
  const mapRef = useRef<MapRef>(null);

  const [nearbySightings, setNearbySightings] =
    useState<NearbySightingsGetResponse>(initialSightings);

  const [selectedSpeciesCode, setSelectedSpeciesCode] = useState<string | null>(
    initialSightings[0]?.speciesCode ?? null,
  );

  const handleMoveEnd = async ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) => {
    if (!mapRef.current) {
      throw new Error(
        "Map ref not set when onMoveEnd called, which should be literally impossible but here we are",
      );
    }

    const bounds = mapRef.current.getBounds();

    if (!bounds) {
      throw new Error("Bounds not available when onMoveEnd called");
    }

    // We get the north east and north west corners of the map
    // and calculate the distance between them to get the horizontal distance
    // of the current map bounds. We can then use this when fetching nearby sightings
    const distance = getHaversineDistance({
      lat1: bounds?.getNorthEast().lat,
      lng1: bounds?.getNorthEast().lng,
      lat2: bounds?.getNorthWest().lat,
      lng2: bounds?.getNorthWest().lng,
    });

    const nearbySightings = await getNearbySightings({
      latitude,
      longitude,
      // We use half the distance between the north east and north west corners
      // as the radius within which to fetch nearby sightings
      // This ensures that we get sightings that are within the current map bounds
      // We also cap the distance to 50km 'cause eBird does accept more than that
      distance: Math.min(distance / 2, 50),
    });

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
        ref={mapRef}
        initialViewState={{
          latitude: initialSightings[0].lat,
          longitude: initialSightings[0].lng,
          zoom: 10,
        }}
        onMoveEnd={(event) => {
          handleMoveEnd({
            latitude: event.viewState.latitude,
            longitude: event.viewState.longitude,
          });
        }}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <GeolocateControl />
        {/* TODO: memoise these markers if we get a performance hit */}
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
                  onClick={() => {
                    // TODO: throw error if map is not initialise
                    if (!mapRef.current) return;

                    mapRef.current.flyTo({
                      center: [sighting.lng, sighting.lat],
                      zoom: 14,
                    });

                    setSelectedSpeciesCode(sighting.speciesCode);
                  }}
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
