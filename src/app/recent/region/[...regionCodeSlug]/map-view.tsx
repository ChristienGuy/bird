import { Map } from "@/app/components/map";
import { Sighting } from "./page";

export function MapView({ sightings }: { sightings: Sighting[] }) {
  return (
    <>
      <Map
        sightings={sightings}
        center={[sightings[0].lng, sightings[0].lat]}
      />
    </>
  );
}
