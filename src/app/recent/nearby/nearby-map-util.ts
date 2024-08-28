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

  // We use the first and second character of the speciesCode
  // to get a unique value for each observation
  // This gets us a value between 65 and 122 (charCodes for [A-Za-z])
  // Which we then normalise to a value between 0 and 1
  // We then multiply this by a small value to get a small distance offset
  // to later modify the lat/lng (very small numbers equate to 100s of meters)
  const { speciesCode } = sighting;

  const latDistance = normalise(speciesCode.charCodeAt(0)) * 0.0025;
  const lngDistance = normalise(speciesCode.charCodeAt(1)) * 0.0025;

  // We then calculate the new lat/lng by offsetting the original lat/lng
  // using both the angle and the distance so that all the points
  // are distributed around the original point in a circle by "random" distances
  return {
    lat: sighting.lat + Math.sin(angle) * latDistance,
    lng: sighting.lng + Math.cos(angle) * lngDistance,
  };
}

function toRadian(degrees: number) {
  return degrees * (Math.PI / 180);
}

function distance(a: number, b: number) {
  return (Math.PI / 180) * (a - b);
}

export function getHaversineDistance({
  lat1,
  lng1,
  lat2,
  lng2,
}: {
  lat1: number;
  lng1: number;
  lat2: number;
  lng2: number;
}) {
  const RADIUS_OF_EARTH_IN_KM = 6371;

  const dLat = distance(lat1, lat2);
  const dLng = distance(lng1, lng2);

  lat1 = toRadian(lat1);
  lat2 = toRadian(lat2);

  // Haversine Formula ¯\_(ツ)_/¯
  // https://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
  const a =
    Math.pow(Math.sin(dLat / 2), 2) +
    Math.pow(Math.sin(dLng / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.asin(Math.sqrt(a));

  let finalDistance = RADIUS_OF_EARTH_IN_KM * c;

  return finalDistance;
}
