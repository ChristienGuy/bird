import { MapIcon, MagnifyingGlassCircleIcon } from "@heroicons/react/16/solid";
import Link, { LinkProps } from "next/link";
import { ShareLocationButton } from "./components/share-location-button";
import { FeaturedBird } from "./components/featured-bird";

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

export default async function Home() {
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
        {/* Featured Bird Card */}
        <div className="col-span-2 md:col-span-1">
          <FeaturedBird />
        </div>

        {/* right half */}
        <div className="col-span-2 col-start-2 md:col-span-1"></div>
        <div className="col-span-2 hover:cursor-pointer">
          <ShareLocationButton />
        </div>
      </section>
    </div>
  );
}
