'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useCurrentUser, useLogout } from '@/lib/hooks/useAuth';
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

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Blog-Less
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium hover:text-black/70 transition-colors">
            Home
          </Link>
          <Link href="/blog" className="text-sm font-medium hover:text-black/70 transition-colors">
            Blog
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-black/70 transition-colors">
            About
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/auth/login">
            <Button variant="outline" size="sm">
              Log in
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button size="sm">
              Sign up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}