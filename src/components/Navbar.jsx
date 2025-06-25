"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { SmoothScrollHero } from "@/components/ui/SmoothScrollHero";
import HomePage from "./Hero";
import { Home, Users, Trophy, Calendar, BookText } from "lucide-react";
import ParallaxScrolls from "@/components/ui/murid";
export default function Navbars() {
  const navItems = [
    { name: "Home", link: "#Home", icon: "home" },
    { name: "Students", link: "#students-7", icon: "users" },
    { name: "Achievements", link: "#achievements-7", icon: "trophy" },
  ];

  const iconMap = {
    home: Home,
    users: Users,
    trophy: Trophy,
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} icons={iconMap} />
          <div className="flex items-center gap-4">
            <NavbarButton variant="secondary line-through">
              <Calendar className="w-4 h-4" />
              Schedule
            </NavbarButton>
            <NavbarButton variant="primary" href="/study-hub">
              <BookText className="w-5 h-5" />
              Study Hub
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full line-through"
              >
                Schedule
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Study Hub
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      <HomePage/>
    </div>
  );
}
