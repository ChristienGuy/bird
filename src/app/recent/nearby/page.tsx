"use client";

import { getNearbySightings, NearbySightingsGetResponse } from "@/app/actions";
import { MapNearby } from "./map-nearby";
import { deterministicallyDistributeLatLng } from "./nearby-map-util";
import { useCoordinates } from "../../contexts/user-coordinates-provider";
import { useEffect, useState } from "react";

export default function NearbySightingsPage() {
  const [nearbySightingsResponse, setNearbySightingsResponse] =
    useState<NearbySightingsGetResponse>();
  const { userCoordinates } = useCoordinates();

  useEffect(() => {
    async function getSightingsResponse() {
      const nearbyResponse = await getNearbySightings({
        latitude: userCoordinates.latitude ?? 53.185335,
        longitude: userCoordinates.longitude ?? -1.688074,
        distance: 10,
      });
      setNearbySightingsResponse(nearbyResponse);
    }
    getSightingsResponse();
  }, []);

  if (!nearbySightingsResponse) {
    return <h1>Loading...</h1>;
  }

  const nearbySightings = nearbySightingsResponse.map((sighting, index) => {
    if (index === 0) return sighting;
    const { lat, lng } = deterministicallyDistributeLatLng(sighting, index);
    return {
      ...sighting,
      lat,
      lng,
    };
  });

  return (
    <div className="h-full">
      <MapNearby initialSightings={nearbySightings} />
    </div>
  );
}
