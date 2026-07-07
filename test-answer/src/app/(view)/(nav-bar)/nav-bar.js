"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import MobileOptions from './(component)/mobile-options'
import DesktopLayout from './(component)/desktop-layout'
import MobileLayout from './(component)/mobile-layout'

const appName = "TodoApp"

export default function NavBar() {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  
  const toggleMenu = () => setMenuIsOpen(prev => !prev);

  // Lock scroll when menu is open
  useEffect(() => {
    if (menuIsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuIsOpen]);

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              {appName}
            </Link>
          </div>
          <DesktopLayout></DesktopLayout>
          <MobileLayout menuIsOpen={menuIsOpen} toggleMenu={toggleMenu}></MobileLayout>
        </div>
      </div>
      <MobileOptions
        menuIsOpen={menuIsOpen}
      ></MobileOptions>
    </nav>
  );
}