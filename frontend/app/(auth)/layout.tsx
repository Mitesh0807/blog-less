import Link from "next/link";
import { ReactNode } from "react";

export const metadata = {
  title: "Authentication | Blog-Less",
  description: "Sign in or create an account to access all features",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-xl font-bold">
            Blog-Less
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-slate-500 border-t">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Blog-Less. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}