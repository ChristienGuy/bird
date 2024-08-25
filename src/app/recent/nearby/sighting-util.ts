import { Sighting } from "@/app/actions";

// TODO: explain 65 is lowest charCode and 122 is largest charCode
function normalise(number: number, min = 65, max = 122) {
  return (number - min) / (max - min);
}

export function deterministicallyDistributeLatLng(
  sighting: Sighting,
  index: number,
  total = 10,
) {
  // Calculating the angle for the current slice
  // based on cutting the circle into {total} equal parts
  // and then multiplying by the index to get the angle
  const angle = (index / total) * Math.PI * 2;

  // We use the first two characters of the scientific name
  // to get a hard to predict but deterministic value
  // This gets us a value between 65 and 122 (charCodes for [A-Za-z])
  // Which we then normalise to a value between 0 and 1
  // We then multiply this by a small value to get a small distance offset
  // to later modify the lat/lng (very small numbers equate to 100s of meters)
  const latDistance = normalise(sighting.sciName.charCodeAt(1)) * 0.0025;
  const lngDistance = normalise(sighting.sciName.charCodeAt(2)) * 0.0025;

  // We then calculate the new lat/lng by offsetting the original lat/lng
  // using both the angle and the distance so that all the points
  // are distributed around the original point in a circle by "random" distances
  return {
    lat: sighting.lat + Math.sin(angle) * latDistance,
    lng: sighting.lng + Math.cos(angle) * lngDistance,
  };
}
