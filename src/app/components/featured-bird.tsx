"use client";

import { birdImageUrlHelper, getRandomArbitrary } from "@/lib/utils";
import {
  getBirdImage,
  getRecentNearbyNotableBird,
  NotableObservation,
} from "../actions";
import Image from "next/image";
import { useCoordinates } from "../contexts/user-coordinates-provider";
import { useEffect, useState } from "react";

export function FeaturedBirdOverlayText({
  randomNotableBird,
}: {
  randomNotableBird: NotableObservation;
}) {
  return (
    <div className="relative left-4 -mb-16 w-fit rounded-lg bg-gray-700 bg-opacity-40 px-4 py-2 text-xs text-white drop-shadow-lg md:top-4 md:text-base">
      <h4 className="">{randomNotableBird.comName}</h4>
      <p className="italic">{randomNotableBird.sciName}</p>
    </div>
  );
}

export function FeaturedBird() {
  const { userCoordinates } = useCoordinates();
  const [birdImage, setBirdImage] = useState("");
  const [randomBird, setRandomBird] = useState<NotableObservation>();

  useEffect(() => {
    const updateFeaturedBird = async () => {
      const latitude: number = userCoordinates.latitude;
      const longitude: number = userCoordinates.longitude;
      const nearbyNotableBirds = await getRecentNearbyNotableBird(
        latitude || 53.185335,
        longitude || -1.688074,
      );
      const randomNotableBird =
        nearbyNotableBirds[getRandomArbitrary(0, nearbyNotableBirds.length)];
      const birdImageResponse = await getBirdImage(randomNotableBird.comName);
      const birdImage = birdImageUrlHelper(birdImageResponse);
      setRandomBird(randomNotableBird);
      setBirdImage(birdImage);
    };
    updateFeaturedBird();
  }, [userCoordinates]);

  if (!randomBird)
    return (
      <div className="h-96 w-full animate-pulse rounded-xl bg-gray-400"></div>
    );

  return (
    <div className="transition-all hover:opacity-80">
      <FeaturedBirdOverlayText randomNotableBird={randomBird} />
      <Image
        className="h-96 w-full rounded-xl object-cover shadow-2xl transition-all hover:cursor-pointer"
        src={birdImage}
        alt="featured bird"
        width={500}
        height={500}
      />
    </div>
  );
}
