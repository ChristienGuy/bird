import { getNearbySightings } from "@/app/actions";
import { MapNearby } from "./map-nearby";

export default async function NearbySightingsPage() {
  const nearbySightings = await getNearbySightings(-1.688074, 53.185335);

  return <MapNearby initialSightings={nearbySightings}></MapNearby>;
}
