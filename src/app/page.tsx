import Link from "next/link";

import { RegionCodeSearch } from "./RegionCodeSearch";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <h1 className="text-4xl mb-12">
        Recent bird sightings by region
        <span role="img" aria-label="bird">
          🐦
        </span>
      </h1>
      <RegionCodeSearch />
    </main>
  );
}
