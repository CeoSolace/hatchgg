import Link from 'next/link';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const year = new Date().getFullYear();
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary-dark text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">TheHatchGGs</h1>
        <nav className="space-x-4">
          <Link href="/">Home</Link>
          <Link href="/about">About Us</Link>
          <Link href="/merch">Merch</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </header>
      <main className="flex-1 p-4">{children}</main>
      <footer className="bg-primary-dark text-white p-4 text-center text-sm">
        &copy; {year} TheHatchGGs. All rights reserved.
      </footer>
    </div>
  );
}