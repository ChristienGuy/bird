import { getNearbySightings } from "@/app/actions";
import { MapNearby } from "./map-nearby";
import { deterministicallyDistributeLatLng } from "./nearby-map-util";

export default async function NearbySightingsPage() {
  const nearbySightingsResponse = await getNearbySightings({
    latitude: 53.185335,
    longitude: -1.688074,
    distance: 10,
  });

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
