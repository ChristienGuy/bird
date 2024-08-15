"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ViewController({
  cardView,
  mapView,
}: {
  cardView: JSX.Element;
  mapView: JSX.Element;
}) {
  const [view, setView] = useState<"cards" | "map">("cards");

  return (
    <>
      <ul className="mb-4 flex flex-row items-center gap-2">
        <li>
          <Button variant={"outline"} onClick={() => setView("cards")}>
            Cards
          </Button>
        </li>
        <li>
          <Button onClick={() => setView("map")}>Map</Button>
        </li>
      </ul>
      <div className="w-full">
        {view === "cards" && cardView}
        {view === "map" && mapView}
      </div>
    </>
  );
}
