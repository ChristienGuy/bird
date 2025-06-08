import { RegionCodeSearch } from "@/app/RegionCodeSearch";

export default function Page() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="mb-12 mt-4 text-4xl">
        Recent bird sightings by Region{" "}
        <span role="img" aria-label="bird">
          🐦
        </span>
      </h1>
      <RegionCodeSearch />
    </div>
  );
}
