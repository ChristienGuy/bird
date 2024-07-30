import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link, { LinkProps } from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bird Sightings",
  description:
    "Some bird sightings per region, powered by the Cornell Labs eBird API",
};

function SidebarLink(
  props: LinkProps & {
    children: React.ReactNode;
  }
) {
  return (
    <Button asChild>
      <Link {...props} />
    </Button>
  );
}

function Sidebar() {
  return (
    <aside className="p-8">
      <nav>
        <ul>
          <li>
            <SidebarLink href="/">Home</SidebarLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>
          <div className="grid grid-cols-1 md:grid-cols-5 md:min-h-screen">
            <Sidebar />
            <div className="col-span-3 lg:col-span-4 lg:border-l p-8">
              {children}
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
