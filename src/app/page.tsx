import { RegionCodeSearch } from "./RegionCodeSearch";

export default async function Home() {
  return (
    <>
      <h1 className="mb-12 text-4xl">
        Recent bird sightings by location{" "}
        <span role="img" aria-label="bird">
          🐦
        </span>
      </h1>
      <RegionCodeSearch />
    </>
  );
}
