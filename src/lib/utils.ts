import { BirdImageResponse } from "@/app/actions";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRandomArbitrary(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

export const birdImageUrlHelper = (response: BirdImageResponse) => {
  let url = "";
  if (!response.query.pages[Object.keys(response.query.pages)[0]].thumbnail) {
    return "/lorem-birdsum.jpg";
  }
  if (response.query) {
    url =
      response.query.pages[Object.keys(response.query.pages)[0]]?.thumbnail
        ?.source;
  }

  return url;
};
