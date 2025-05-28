import { MapIcon, MagnifyingGlassCircleIcon } from "@heroicons/react/16/solid";
import Link, { LinkProps } from "next/link";

function LinkListItem({ children }: { children: React.ReactNode }) {
  return <li className="flex w-full">{children}</li>;
}

function StyledLink({
  href,
  children,
  description,
  backgroundColor,
  icon,
}: LinkProps & { children: React.ReactNode } & {
  description: string;
  backgroundColor: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className={`flex h-24 w-full p-4 ${backgroundColor} rounded-lg text-white`}
    >
      <Link
        href={href}
        className="flex h-full w-full flex-row items-start justify-between"
      >
        <div className="flex h-full min-w-0 flex-1 flex-col pr-4 text-left lg:gap-2">
          <h2 className="text-lg font-bold">{children}</h2>
          <p className="break-words text-xs">{description}</p>
        </div>
        <div className="ml-6 flex h-full flex-shrink-0 items-center">
          {icon}
        </div>
      </Link>
    </div>
  );
}

export default async function Home() {
  return (
    <div className="mt-6 flex flex-col items-center">
      <ul className="flex w-full max-w-[80%] flex-col gap-6">
        <LinkListItem>
          <StyledLink
            href="/recent/nearby"
            description="Map view of bird sightings wherever you want to look"
            backgroundColor="bg-primary"
            icon={<MapIcon className="h-full w-full" />}
          >
            Nearby Birds
          </StyledLink>
        </LinkListItem>
        <LinkListItem>
          <StyledLink
            href="/recent/region"
            description="Search bird sightings in a specific city, town, or state"
            backgroundColor="bg-secondary"
            icon={<MagnifyingGlassCircleIcon className="h-full w-full" />}
          >
            Region Search
          </StyledLink>
        </LinkListItem>
      </ul>
    </div>
  );
}
