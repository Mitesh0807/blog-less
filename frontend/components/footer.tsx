'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Blog-Less</h3>
            <p className="text-slate-600 mb-4">
              A minimal blogging platform for developers and content creators.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-slate-600 hover:text-black transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-600 hover:text-black transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-600 hover:text-black transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-black transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-black transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@blog-less.com"
                  className="text-slate-600 hover:text-black transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} Blog-Less. All rights reserved.
        </div>
      </div>
    </footer>
  );
}