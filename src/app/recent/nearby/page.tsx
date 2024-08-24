"use client";

import { useEffect, useState } from "react";
import MapComponent from "../../components/map";
import { getNearbySightings } from "@/app/actions";

export type NearbySightingsResponse = Array<{
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
}>;

export default function NearbySightingsPage() {
  const [nearbySightings, setNearbySightings] =
    useState<NearbySightingsResponse>();

  const handleMoveEnd = (longitude: number, latitude: number) => {
    getNearbySightings(longitude, latitude).then((response) => {
      setNearbySightings(response);
    });
  };

  useEffect(() => {
    getNearbySightings(-1.688074, 53.185335).then((response) => {
      setNearbySightings(response);
    });
  }, []);

  return (
    <div>
      <MapComponent
        className="h-dvh w-full"
        onMoveEnd={handleMoveEnd}
        nearbySightings={nearbySightings}
      />
    </div>
  );
}
