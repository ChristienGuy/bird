import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/Card";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <h1 className="text-4xl mb-12">
        Recent bird sightings by region
        <span role="img" aria-label="bird">
          🐦
        </span>
      </h1>
      <Link
        // TODO: abstract this into an Anchor component to share styles
        className="font-medium text-primary underline underline-offset-2"
        href="/recent/gb/eng/esx"
      >
        Recent sightings in East Sussex
      </Link>
    </main>
  );
}
