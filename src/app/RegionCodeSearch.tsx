"use client";

import { FormEvent, useState } from "react";
import { findRegionCode } from "./actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegionCodeSearch() {
  "use client";
  const [searchQuery, setSearchQuery] = useState("");
  const [regionCode, setRegionCode] = useState("");
  const [regionName, setRegionName] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const region = await findRegionCode(searchQuery);
    setRegionCode(region.code);
    setRegionName(region.name);
  };

  const regionPath = regionCode.toLowerCase().split("-").join("/");

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
      {regionName && (
        <Link
          // TODO: abstract this into an Anchor component to share styles
          className="font-medium text-primary underline underline-offset-2"
          href={`/recent/${regionPath}`}
        >
          View recent sightings in {regionName}
        </Link>
      )}
    </div>
  );
}
