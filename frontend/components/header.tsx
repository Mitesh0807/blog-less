"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCurrentUser, useLogout } from "@/lib/hooks/useAuth";
import { Button } from "./ui/button";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: user, isLoading } = useCurrentUser();
  const logout = useLogout();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout.mutate();
  };

  const isAuthPage = pathname?.startsWith("/auth/");

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Blog-Less
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className={`text-sm font-medium hover:text-black/70 transition-colors ${pathname === "/" ? "text-black" : "text-black/60"}`}
          >
            Home
          </Link>
          <Link
            href="/blog"
            className={`text-sm font-medium hover:text-black/70 transition-colors ${pathname === "/blog" || pathname?.startsWith("/blog/") ? "text-black" : "text-black/60"}`}
          >
            Blog
          </Link>
          <Link
            href="/about"
            className={`text-sm font-medium hover:text-black/70 transition-colors ${pathname === "/about" ? "text-black" : "text-black/60"}`}
          >
            About
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className={`text-sm font-medium hover:text-black/70 transition-colors ${pathname === "/dashboard" || pathname?.startsWith("/dashboard/") ? "text-black" : "text-black/60"}`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {!isAuthPage && (
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="h-8 w-16 bg-slate-100 animate-pulse rounded"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <span className="block font-medium">
                    {user.name || user.username}
                  </span>
                  {user.role === "admin" && (
                    <span className="text-xs text-blue-600">Admin</span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  disabled={logout.isPending}
                >
                  {logout.isPending ? "Logging out..." : "Log out"}
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        )}

        <button
          className="md:hidden flex items-center"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {mobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 12h16M4 6h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden py-4 px-4 border-t">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-sm font-medium hover:text-black/70 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium hover:text-black/70 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-black/70 transition-colors"
            >
              About
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className="text-sm font-medium hover:text-black/70 transition-colors"
              >
                Dashboard
              </Link>
            )}
            {!isAuthPage && !user && !isLoading && (
              <div className="pt-2 border-t">
                <Link href="/login" className="block py-2">
                  Log in
                </Link>
                <Link href="/register" className="block py-2">
                  Sign up
                </Link>
              </div>
            )}
            {user && (
              <div className="pt-2 border-t">
                <button
                  onClick={handleLogout}
                  className="block py-2"
                  disabled={logout.isPending}
                >
                  {logout.isPending ? "Logging out..." : "Log out"}
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
