"use client";
import { getNearbySightings, NearbySightingsGetResponse } from "@/app/actions";
import { useState } from "react";
import { GeolocateControl, Marker } from "react-map-gl";

import { Map } from "@/app/components/map";

export function MapNearby({
  initialSightings,
}: {
  initialSightings: NearbySightingsGetResponse;
}) {
  const [nearbySightings, setNearbySightings] =
    useState<NearbySightingsGetResponse>(initialSightings);

  const handleMoveEnd = async (longitude: number, latitude: number) => {
    const nearbySightings = await getNearbySightings(longitude, latitude);
    setNearbySightings(nearbySightings);
  };

  return (
    <Map
      onMoveEnd={(event) => {
        console.log(event);
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
          key={`${sighting.locId}-${sighting.sciName}`}
          latitude={sighting.lat}
          longitude={sighting.lng}
        >
          <div className="flex size-6 flex-col items-center justify-center rounded-full bg-white">
            <div className="size-3 rounded-full bg-primary" />
          </div>
        </Marker>
      ))}
    </Map>
  );
}
