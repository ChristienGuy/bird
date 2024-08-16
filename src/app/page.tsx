import { RegionCodeSearch } from "./RegionCodeSearch";

const unused = 0;

export default async function Home() {
  return (
    <>
      <h1 className="mb-12 text-4xl">
        Recent bird sightings by region{" "}
        <span role="img" aria-label="bird">
          🐦
        </span>
      </h1>
      <RegionCodeSearch />
    </>
  );
}
