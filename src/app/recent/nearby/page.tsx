import { getNearbySightings } from "@/app/actions";
import { MapNearby } from "./map-nearby";
import { deterministicallyDistributeLatLng } from "./sighting-util";

export default async function NearbySightingsPage() {
  const nearbySightingsResponse = await getNearbySightings(
    -1.688074,
    53.185335,
  );

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
