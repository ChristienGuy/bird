import { RegionCodeSearch } from "@/app/RegionCodeSearch";

export default function Page() {
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
