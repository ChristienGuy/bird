import { MapIcon, MagnifyingGlassCircleIcon } from "@heroicons/react/16/solid";
import Link, { LinkProps } from "next/link";
import {
  getBirdImage,
  BirdImageResponse,
  getRecentNearbyNotableBird,
} from "./actions";
import Image from "next/image";
import { getRandomArbitrary } from "@/lib/utils";

function LinkCard({
  href,
  children,
  backgroundColour,
}: LinkProps & {
  children: React.ReactNode;
  backgroundColour: string;
}) {
  return (
    <li className={`flex w-full`}>
      <Link
        href={href}
        className={`flex h-full w-full justify-between p-4 ${backgroundColour} rounded-lg text-white`}
      >
        {children}
      </Link>
    </li>
  );
}

function LinkCardText({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col md:p-2">{children}</div>;
}

function LinkCardTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-bold md:text-2xl">{children}</h2>;
}
function LinkCardDescription({ children }: { children: React.ReactNode }) {
  return <p className="break-words text-xs md:text-base">{children}</p>;
}
function LinkCardIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="ml-6 flex h-full flex-shrink-0 items-center">
      {children}
    </div>
  );
}

// TODO: add type for this and make this function less rigid
const birdImageUrlHelper = (response: BirdImageResponse) => {
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

export default async function Home() {
  const nearbyNotableBirds = await getRecentNearbyNotableBird(
    53.185335,
    -1.688074,
  );

  const randomNotableBird =
    nearbyNotableBirds[getRandomArbitrary(0, nearbyNotableBirds.length)];
  const birdImageResponse = await getBirdImage(randomNotableBird.comName);
  const birdImage = birdImageUrlHelper(birdImageResponse);
  console.log(birdImage);

  return (
    <div className="mx-auto mt-6 flex max-w-[80%] flex-col items-center">
      <ul className="flex w-full flex-col gap-6">
        {/* Nearby */}
        <LinkCard backgroundColour="bg-primary" href="/recent/nearby">
          <LinkCardText>
            <LinkCardTitle>Nearby Birds</LinkCardTitle>
            <LinkCardDescription>
              Map view of bird sightings wherever you want to look
            </LinkCardDescription>
          </LinkCardText>
          <LinkCardIcon>
            <MapIcon className="h-16 md:h-24" />
          </LinkCardIcon>
        </LinkCard>

        {/* Region Search */}
        <LinkCard backgroundColour="bg-secondary" href="/recent/region">
          <LinkCardText>
            <LinkCardTitle>Region Search</LinkCardTitle>
            <LinkCardDescription>
              Search bird sightings in a specific city, town, or state
            </LinkCardDescription>
          </LinkCardText>
          <LinkCardIcon>
            <MagnifyingGlassCircleIcon className="h-16 md:h-24" />
          </LinkCardIcon>
        </LinkCard>
      </ul>

      <section className="mt-8 grid h-full w-full grid-cols-2 pb-20">
        <div className="transition-all hover:opacity-80">
          {/* TODO: Make more responsive - Change hardcoded values to calc?  */}
          <div className="relative left-4 top-4 -mb-16 w-fit rounded-lg bg-gray-700 bg-opacity-40 px-4 py-2 text-white drop-shadow-lg">
            <h4 className="">{randomNotableBird.comName}</h4>
            <p className="italic">{randomNotableBird.sciName}</p>
          </div>
          <Image
            className="h-96 w-full rounded-xl object-cover shadow-2xl transition-all hover:cursor-pointer"
            src={birdImage}
            alt="featured bird"
            width={500}
            height={500}
          />
        </div>
        {/* left half */}
        {/* Featured bird */}
        {/* Fullsized image */}
        {/* Name at bottom */}
        {/* Additional text */}
        {/* right half */}
      </section>
    </div>
  );
}
