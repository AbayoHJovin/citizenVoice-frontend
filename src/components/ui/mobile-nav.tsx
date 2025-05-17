
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "./button";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";

interface MobileNavProps {
  links: {
    href: string;
    label: string;
  }[];
  callToAction?: {
    primary: {
      href: string;
      label: string;
    };
    secondary?: {
      href: string;
      label: string;
    };
  };
}

export function MobileNav({ links, callToAction }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="px-0 text-white md:hidden"
          aria-label="Open mobile menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-xs bg-[#020240] text-white">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-lg font-bold">Menu</span>
            <Button
              variant="ghost"
              className="px-2 text-white"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 py-8">
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="flex py-2 text-lg hover:text-white/80 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="border-t border-white/10 pt-4 space-y-3">
            {callToAction?.secondary && (
              <Link
                to={callToAction.secondary.href}
                onClick={() => setIsOpen(false)}
                className="block w-full"
              >
                <Button
                  variant="outline"
                  className="border-white text-[#020240] bg-white  w-full"
                >
                  {callToAction.secondary.label}
                </Button>
              </Link>
            )}
            {callToAction?.primary && (
              <Link
                to={callToAction.primary.href}
                onClick={() => setIsOpen(false)}
                className="block w-full"
              >
                <Button 
                  className="bg-white text-[#020240] hover:bg-white/90 w-full"
                >
                  {callToAction.primary.label}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav;
