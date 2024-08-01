"use client";
import { Input } from "@/components/ui/input";
import { findSpecies, Species } from "../actions";
import { useState } from "react";
import { FuseResult } from "fuse.js";

async function getSpecies() {
  if (!process.env.EBIRD_API_TOKEN) {
    throw new Error("Missing eBird API token");
  }

  const url = `https://api.ebird.org/v2/ref/taxonomy/ebird?fmt=json`;

  const headers = new Headers();
  headers.append("X-eBirdApiToken", process.env.EBIRD_API_TOKEN);
  headers.append(
    "Api-User-Agent",
    "bird-sightings/0.1 (christien.guy@gmail.com)"
  );

  const response = await fetch(url, {
    headers,
  });

  return response.json();
}

export default function SpeciesPage() {
  const [species, setSpecies] = useState<FuseResult<Species>[]>([]);

  const handleSearch = async (query: string) => {
    const species = await findSpecies(query);
    setSpecies(species);
  };
  return (
    <div>
      <h1>Species</h1>
      <form>
        <Input
          placeholder="Search for a species"
          onChange={(event) => {
            handleSearch(event.target.value);
          }}
        />
      </form>
      <code>
        <pre>{JSON.stringify(species, null, 2)}</pre>
      </code>
    </div>
  );
}
