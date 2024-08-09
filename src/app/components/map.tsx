"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl, { GeoJSONSource } from "mapbox-gl";
import { useEffect, useRef } from "react";

export default function MapComponent() {
  const mapContainer = useRef<HTMLDivElement>(null);

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
        center: [-1.688074, 53.185335], // make center the most recent sighted bird or something
        zoom: 10,
        maxZoom: 15,
        attributionControl: false,
      });

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

  return (
    <div ref={mapContainer} className="mt-4 h-96 w-full">
      {" "}
    </div>
  );
}
