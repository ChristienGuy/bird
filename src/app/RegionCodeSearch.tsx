"use client";

import { FormEvent, useCallback, useState } from "react";
import { findRegions, FindRegionsResponse } from "./actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebounceCallback } from "usehooks-ts";

export function RegionCodeSearch() {
  "use client";
  const [searchQuery, setSearchQuery] = useState("");
  const [regionSearchResults, setRegionSearchResults] = useState<
    FindRegionsResponse[]
  >([]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const searchMatches = await findRegions(searchQuery);
    setRegionSearchResults(searchMatches);
  };

  const handleSearch = useCallback(
    async (query: string) => {
      console.log("debouncedFindRegions", query);

      if (!query) {
        return;
      }

      const searchMatches = await findRegions(query);
      setRegionSearchResults(searchMatches);
    },
    [setRegionSearchResults],
  );

  const debouncedHandleSearch = useDebounceCallback(handleSearch, 200);

  return (
    <div className="flex flex-col gap-4">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <Label htmlFor="regionSearch" className="gap-2">
          Location:
        </Label>
        <Input
          id="regionSearch"
          value={searchQuery}
          onChange={(event) => {
            debouncedHandleSearch(event.target.value);
            setSearchQuery(event.target.value);
          }}
          type="text"
          placeholder="Search for a county, city, region..."
        />
        <Button type="submit">Search for Region</Button>
      </form>
      {regionSearchResults.length > 0 &&
        regionSearchResults.map((result) => {
          const regionPath = result.item.code
            .toLowerCase()
            .split("-")
            .join("/");
          return (
            <Link
              key={result.item.code}
              // TODO: abstract this into an Anchor component to share styles
              className="font-medium text-primary underline underline-offset-2"
              href={{
                pathname: `/recent/region/${regionPath}`,
              }}
            >
              View recent sightings in {result.item.fullHierarchyName}
            </Link>
          );
        })}
    </div>
  );
}
