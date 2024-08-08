"use client";
import { Input } from "@/components/ui/input";
import { findSpecies, SpeciesGetResponse } from "../actions";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function SpeciesPage() {
  const [speciesSearchResponse, setSpeciesSearchResponse] =
    useState<SpeciesGetResponse>([]);

  const handleSearch = async (query: string) => {
    const species = await findSpecies(query);
    setSpeciesSearchResponse(species);
  };
  return (
    <div>
      <h1>Species</h1>
      <form className="mb-4">
        <Input
          className="shadow-sm"
          placeholder="Search for a species"
          onChange={(event) => {
            handleSearch(event.target.value);
          }}
        />
      </form>
      <ul className="flex flex-col gap-2">
        {speciesSearchResponse.map(({ item: species }) => (
          <li
            className="flex w-full flex-col gap-2 rounded-lg border p-4"
            key={species.speciesCode}
          >
            <h2 className="font-semibold">{species.comName}</h2>
            <p className="text-sm text-gray-500">{species.sciName}</p>
            <div>
              <Badge variant="outline">{species.familyComName}</Badge>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
