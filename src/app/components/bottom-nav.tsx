"use client";
import {
  GlobeAltIcon,
  HomeIcon,
  MagnifyingGlassCircleIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";

function BottomNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <Link
      aria-current={pathname === href ? "page" : undefined}
      className="flex px-6 py-4 active:bg-gray-200 aria-[current='page']:text-primary"
      href={href}
    >
      {children}
    </Link>
  );
}
export function BottomNav() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t border-t-gray-300 bg-white text-center shadow-sm">
      <nav className="flex justify-center">
        <ul className="grid grid-cols-4">
          <li>
            <BottomNavLink href="/">
              <span className="sr-only">Home</span>
              <HomeIcon className="h-6 w-6 transition-colors" />
            </BottomNavLink>
          </li>
          <li>
            <BottomNavLink href="/recent/nearby">
              <span className="sr-only">Recent nearby sightings</span>
              <GlobeAltIcon className="h-6 w-6 transition-colors" />
            </BottomNavLink>
          </li>
          <li>
            <BottomNavLink href="/species">
              <span className="sr-only">Home</span>
              <MagnifyingGlassCircleIcon className="h-6 w-6 transition-colors" />
            </BottomNavLink>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
