"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="fixed top-0 left-0 right-0 flex items-center justify-center w-full bg-blue px-6 h-16 z-50">
      <div className="flex w-full md:w-[85%] items-center justify-between h-full">
        <div className="flex items-center h-full">
          <Link
            href="/"
            className="flex items-center gap-2 relative h-full w-40 md:w-60"
          >
            <Image
              src={"/brand/imagotype-landing.png"}
              alt="Logo Oncoactive"
              fill
              className="object-contain"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/acerca-de"
            className={`relative text-white transition-colors pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-magent after:transition-all after:duration-300 ${
              pathname === "/acerca-de"
                ? "after:w-full"
                : "after:w-0 hover:after:w-full"
            }`}
          >
            Acerca de
          </Link>
          <Link
            href="/educacion"
            className={`relative text-white transition-colors pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-magent after:transition-all after:duration-300 ${
              pathname === "/educacion"
                ? "after:w-full"
                : "after:w-0 hover:after:w-full"
            }`}
          >
            Educación
          </Link>
          <Link
            href="/contacto"
            className={`relative text-white transition-colors pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-magent after:transition-all after:duration-300 ${
              pathname === "/contacto"
                ? "after:w-full"
                : "after:w-0 hover:after:w-full"
            }`}
          >
            Contacto
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/signin">
            <Button variant="outline">Ingresar</Button>
          </Link>
          <Link href="/signup">
            <Button>Registrarme</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 z-50"
          aria-label="Toggle menu"
        >
          <span
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              isMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 top-16 bg-blue z-40 transition-all duration-300 ${
          isMenuOpen
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-full pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center gap-6 pt-8">
          <Link
            href="/acerca-de"
            onClick={toggleMenu}
            className={`text-xl transition-colors ${
              pathname === "/acerca-de"
                ? "text-magent"
                : "text-white hover:text-magent"
            }`}
          >
            Acerca de
          </Link>
          <Link
            href="/educacion"
            onClick={toggleMenu}
            className={`text-xl transition-colors ${
              pathname === "/educacion"
                ? "text-magent"
                : "text-white hover:text-magent"
            }`}
          >
            Educación
          </Link>
          <Link
            href="/contacto"
            onClick={toggleMenu}
            className={`text-xl transition-colors ${
              pathname === "/contacto"
                ? "text-magent"
                : "text-white hover:text-magent"
            }`}
          >
            Contacto
          </Link>

          <div className="flex flex-col items-center gap-4 mt-8">
            <Link href="/signin" onClick={toggleMenu}>
              <Button variant="outline" className="w-40">
                Ingresar
              </Button>
            </Link>
            <Link href="/signup" onClick={toggleMenu}>
              <Button className="w-40">Registrarme</Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
