"use client";

import { FormEvent, useState } from "react";
import { findAllRegions, Region } from "./actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegionCodeSearch() {
  "use client";
  const [searchQuery, setSearchQuery] = useState("");
  const [allMatchingRegions, setAllMatchingRegions] = useState<Array<Region>>(
    []
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const regions = await findAllRegions(searchQuery);
    setAllMatchingRegions(regions);
  };

  return (
    <div className="flex flex-col gap-4">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <Label htmlFor="regionSearch" className="gap-2">
          Search for a region:
        </Label>
        <Input
          id="regionSearch"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          type="text"
        />
        <Button type="submit">Search for Region</Button>
      </form>
      {allMatchingRegions.length > 0 &&
        allMatchingRegions.map((region) => {
          const regionPath = region.code.toLowerCase().split("-").join("/");
          return (
            <Link
              key={region.code}
              // TODO: abstract this into an Anchor component to share styles
              className="font-medium text-primary underline underline-offset-2"
              href={`/recent/${regionPath}`}
            >
              View recent sightings in {region.name}
            </Link>
          );
        })}
    </div>
  );
}
