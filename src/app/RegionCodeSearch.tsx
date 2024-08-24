"use client";

import { useCallback, useState } from "react";
import { findRegions, FindRegionsResponse, Region } from "./actions";
import { useDebounceCallback } from "usehooks-ts";

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { useRouter } from "next/navigation";

/**
 * Takes the region object and returns the ancestor hierarchy name
 * e.g if the region is a subnational1, it should return
 * `${country}`.
 *
 * If the region is a subnational2, it should
 * return `${subnational1}, ${country}`.
 * @param region The region from a findRegions response
 */
function getRegionAncestorHierarchyName(region: Region) {
  if (region.type === "subnational1") {
    return region.country;
  } else if (region.type === "subnational2") {
    return `${region.subnational1}, ${region.country}`;
  }
  return region.country;
}

export function RegionCodeSearch() {
  "use client";
  const [regionSearchResults, setRegionSearchResults] = useState<
    FindRegionsResponse[]
  >([]);
  const router = useRouter();

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
      <Combobox<Region>
        onChange={(region) => {
          if (!region) return;

          const regionPath = region.code.toLowerCase().split("-").join("/");

          router.push(`/recent/region/${regionPath}`);
        }}
      >
        <ComboboxInput<Region>
          className="w-full rounded-lg border-gray-400 p-3"
          aria-label="Location search"
          onChange={(event) => {
            debouncedHandleSearch(event.target.value);
          }}
          displayValue={(region) => region?.name}
        />
        {regionSearchResults.length > 0 && (
          <ComboboxOptions>
            {regionSearchResults.map(({ item: region }) => {
              const name = region[region.type];
              const remainingHeriarchy = getRegionAncestorHierarchyName(region);

              return (
                <ComboboxOption
                  className="group bg-white text-orange-400"
                  key={region.code}
                  value={region}
                >
                  <div className="flex flex-col p-3 group-data-[focus]:bg-orange-400 group-data-[focus]:text-white">
                    <div className="font-medium">{name}</div>
                    <div className="text-sm">{remainingHeriarchy}</div>
                  </div>
                </ComboboxOption>
              );
            })}
          </ComboboxOptions>
        )}
      </Combobox>
    </div>
  );
}
