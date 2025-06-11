"use client";

import { useCoordinates } from "../contexts/user-coordinates-provider";

export type Coords = {
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  latitude: number;
  longitude: number;
  speed: number | null;
};
export type GeolocationPosition = {
  coords: Coords;
  timestamp: number;
};
export function ShareLocationButton() {
  const { setUserCoordinates } = useCoordinates();
  function getLocation() {
    function success(position: GeolocationPosition) {
      const coordinates = position.coords;

      setUserCoordinates({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });
    }
    function error(error: any) {
      console.warn(`ERROR(${error.code}): ${error.message}`);
    }
    navigator.geolocation.getCurrentPosition(success, error);
  }
  return (
    <button
      onClick={getLocation}
      className="mt-4 w-full rounded-xl bg-sky-300 px-6 py-2 text-lg text-gray-800 transition-all duration-300 hover:bg-sky-400 active:opacity-50"
    >
      Share Location
    </button>
  );
}
