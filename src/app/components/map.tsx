"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Sighting } from "../recent/region/[...regionCodeSlug]/page";

export function Map({
  className,
  sightings,
  center = [-1.688074, 53.185335],
}: {
  className?: string;
  sightings?: Sighting[];
  center: [number, number];
}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN) {
    throw new Error("Missing mapBox API token");
  }

  useEffect(() => {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN;
    mapboxgl.accessToken = `${accessToken}`;

    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/outdoors-v12",
        center: center, // make center the most recent sighted bird or something
        zoom: 10,
        maxZoom: 15,
        attributionControl: false,
      });

      mapRef.current = map;

      map.addControl(new mapboxgl.NavigationControl(), "top-left");

      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        }),
      );

      return () => map.remove();
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }
    const map = mapRef.current;
    // We have to make sure we clear mapRef.current after removing the markers
    // to avoid a memory leak where the array keeps growing every time the user
    // moves the map around.
    markersRef.current.forEach((marker) => {
      marker.remove();
    });
    markersRef.current = [];

    const bounds = new mapboxgl.LngLatBounds();

    sightings?.forEach((sighting) => {
      const marker = new mapboxgl.Marker().setLngLat([
        sighting.lng,
        sighting.lat,
      ]);
      bounds.extend({
        lng: sighting.lng,
        lat: sighting.lat,
      });

      marker.addTo(map);

      markersRef.current.push(marker);
    });

    map.fitBounds(bounds, {
      padding: 65,
    });
  }, [sightings]);

  return (
    <div ref={mapContainer} className={cn("h-96 w-full", className)}></div>
  );
}
