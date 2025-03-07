import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { HamburgerMenu } from "@/components/ui/hamburger-menu";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [textColor, setTextColor] = useState("text-white"); // Added text color state

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Only change text color on scroll for home page
      if (location === "/") {
        setTextColor(window.scrollY > 20 ? "text-black" : "text-white");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);

  // Set white background for contact, products, and about pages
  const isWhiteBgPage = location === "/about" || location === "/products" || location === "/contact";
  
  // Set initial text color based on current page
  useEffect(() => {
    if (location === "/") {
      setTextColor(scrolled ? "text-black" : "text-white");
    } else {
      setTextColor("text-black");
    }
  }, [location, scrolled]);

  return (
    <header 
      className={`sticky top-0 z-50 w-full ${isWhiteBgPage || scrolled ? 'bg-white' : 'bg-transparent'}`}
      style={{ transition: "background-color 0.3s ease" }}
    >
      <div className="container mx-auto px-6 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center">
          <img 
            src="/URJATECH LOGO.png" 
            alt="Urjatech Logo" 
            className="h-10 md:h-12 w-auto pt-1"
          />
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-2">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    `${textColor} px-4 py-2 text-lg font-black uppercase rounded-sm transition-colors duration-300`, // Added textColor class
                    location === item.href
                      ? "bg-white/0"
                      : `hover:text-[#01AEEF]` 
                  )}
                >
                  <Link href={item.href}>
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Navigation */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <HamburgerMenu 
              open={open} 
              setOpen={setOpen}
              color={!isWhiteBgPage && !scrolled ? "white" : "black"}
            />
          </SheetTrigger>
          <SheetContent className="bg-white text-black border-0 fixed inset-0 w-full h-full p-0 m-0 max-w-full flex items-center justify-center">
            <div className="bg-white text-black p-6 w-full h-full max-h-full">
              <div className="flex justify-center mb-6">
                <img 
                  src="/URJATECH LOGO.png" 
                  alt="Urjatech Logo" 
                  className="h-8 w-auto"
                />
              </div>
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      `${textColor} text-lg font-black uppercase transition-colors duration-300 hover:text-[#01AEEF] px-4 py-2`, // Added textColor class
                      location === item.href && 'text-primary'
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}