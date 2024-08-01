"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link, { LinkProps } from "next/link";
import { useState } from "react";

function MobileLink({
  onOpenChange,
  ...props
}: LinkProps & {
  children: React.ReactNode;
  onOpenChange: (open: boolean) => void;
}) {
  return <Link onClick={() => onOpenChange(false)} {...props} />;
}

function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>Menu</Button>
      </SheetTrigger>
      <SheetContent>
        <nav>
          <ul>
            <li>
              <MobileLink onOpenChange={setOpen} href="/">
                Home
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
    <div className="flex flex-row p-2">
      <MobileNav />
    </div>
  );
}
