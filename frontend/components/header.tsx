"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Header() {
  const isMobile = useMobile()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "#", label: "Documentation" },
    { href: "#", label: "About" },
  ]

  return (
    <header className="bg-applio-dark text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl md:text-2xl font-bold">Encore Leshan</h1>
        </div>

        {isMobile ? (
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-applio-dark text-white w-[250px] p-0">
              <nav className="flex flex-col p-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="py-3 px-2 hover:bg-applio-teal/20 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-applio-teal transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
