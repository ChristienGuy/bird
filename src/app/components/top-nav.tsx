"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Bars3Icon, HomeIcon } from "@heroicons/react/20/solid";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type MobileLinkProps = LinkProps & {
  children: React.ReactNode;
  className?: string;
  onOpenChange: (open: boolean) => void;
};
function MobileLink({ onOpenChange, className, ...props }: MobileLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === props.href;
  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex flex-row items-center w-full rounded px-4 py-2 aria-[current='page']:bg-gray-100",
        className
      )}
      onClick={() => onOpenChange(false)}
      {...props}
    />
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost">
          <Bars3Icon className="size-5" />
          <span className="sr-only">menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <h2 className="text-xl font-bold">Birds</h2>
        <nav className="mt-3">
          <ul>
            <li>
              <MobileLink onOpenChange={setOpen} href="/">
                <HomeIcon className="size-4 mr-2" /> Home
              </MobileLink>
            </li>
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function TopNav() {
  return (
    <div>
      <div className="flex flex-row p-2">
        <MobileNav />
      </div>
      <Separator />
    </div>
  );
}
