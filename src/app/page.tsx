import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import Link, { LinkProps } from "next/link";

function LinkListItem({ children }: { children: React.ReactNode }) {
  return <li className="flex w-full">{children}</li>;
}

function StyledLink({
  href,
  children,
}: LinkProps & { children: React.ReactNode }) {
  return (
    <Button asChild className="flex w-full items-center p-6">
      <Link href={href}>
        {children}
        <ChevronRightIcon className="ml-auto h-6 w-6" />
      </Link>
    </Button>
  );
}

export default async function Home() {
  return (
    <div className="flex flex-col items-center">
      <ul className="flex w-full max-w-[80%] flex-col gap-3">
        <LinkListItem>
          <StyledLink href="/recent/nearby">See nearby sightings</StyledLink>
        </LinkListItem>
        <LinkListItem>
          <StyledLink href="/recent/region">Search by Location</StyledLink>
        </LinkListItem>
      </ul>
    </div>
  );
}
