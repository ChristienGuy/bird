"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import { NearbySightingsResponse } from "../recent/nearby/page";

export default function MapComponent({
  onDragEnd,
  nearbySightings,
}: {
  nearbySightings: NearbySightingsResponse | undefined;
  onDragEnd: (longitude: number, latitude: number) => void;
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
        center: [-1.688074, 53.185335], // make center the most recent sighted bird or something
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

      map.on("dragend", () => {
        // TODO: Only works with user input. Does not work with geolocate, add that in too.
        const longitude = map.getCenter().lng;
        const latitude = map.getCenter().lat;
        onDragEnd(longitude, latitude);
      });

      return () => map.remove();
    }
  }, []);

  useEffect(() => {
    markersRef.current.forEach((marker) => {
      marker.remove();
    });
    if (mapRef.current) {
      nearbySightings?.forEach((sightingsData) => {
        const marker = new mapboxgl.Marker().setLngLat([
          sightingsData.lng,
          sightingsData.lat,
        ]);
        if (mapRef.current) {
          {
            marker.addTo(mapRef.current);
          }
        }
        markersRef.current.push(marker);
      });
    }
  }, [nearbySightings]);

  return <div ref={mapContainer} className="mt-4 h-[34em] w-full"></div>;
}
