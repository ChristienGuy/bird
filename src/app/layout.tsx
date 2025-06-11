import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TopNav } from "./components/top-nav";
import { cn } from "@/lib/utils";
import { UserCoordinatesProvider } from "./contexts/user-coordinates-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bird Sightings",
  description:
    "Some bird sightings per region, powered by the Cornell Labs eBird API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(`bg-orange-50`, inter.className)}>
        <UserCoordinatesProvider>
          <main>
            <div className="grid min-h-dvh grid-rows-[auto_1fr]">
              <TopNav />
              <div>{children}</div>
            </div>
          </main>
        </UserCoordinatesProvider>
      </body>
    </html>
  );
}
