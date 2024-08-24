"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import { NearbySightingsResponse } from "../recent/nearby/page";

if (!process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN) {
  throw new Error("Missing mapBox API token");
}

export function Map({
  onMoveEnd,
  nearbySightings,
  className,
}: {
  nearbySightings: NearbySightingsResponse | undefined;
  onMoveEnd: (longitude: number, latitude: number) => void;
  className?: string;
}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

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

      let geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      });

      map.addControl(geolocate);

      return () => map.remove();
    }
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleMoveEnd = () => {
      const longitude = map.getCenter().lng;
      const latitude = map.getCenter().lat;
      onMoveEnd(longitude, latitude);
    };

    map.on("moveend", handleMoveEnd);

    return () => {
      if (map) {
        map.off("moveend", handleMoveEnd);
      }
    };
  }, [onMoveEnd]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((marker) => {
      marker.remove();
    });
    markersRef.current = [];

    nearbySightings?.forEach((sightingsData) => {
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h3>${sightingsData.comName}</h3>
          <p>${sightingsData.locName}</p>
          <p>${sightingsData.howMany} Sighted</p>`);

      const marker = new mapboxgl.Marker()
        .setLngLat([sightingsData.lng, sightingsData.lat])
        .setPopup(popup);

      marker.addTo(map);

      markersRef.current.push(marker);
    });
  }, [nearbySightings]);

  return <div ref={mapContainer} className={className}></div>;
}
