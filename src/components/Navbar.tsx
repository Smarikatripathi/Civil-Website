"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import SearchBar from "./SearchBar/SearchBar";
import dynamic from "next/dynamic";

const AuthModal = dynamic(() => import("@/components/auth/AuthModal"), {
  ssr: false,
});

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    "Calculator",
    "Converter",
    "Resources",
    "Knowledge-Hub", // Corrected spelling
    "About",
  ];

  return (
    <>
      <nav
        className={`fixed w-full top-0 z-[999] transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100"
            : "bg-white/80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo Section */}
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/" className="group flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out" />
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="text-2xl font-bold text-white relative z-10">
                    C
                  </span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300">
                  CivilPro
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <motion.div key={item} className="relative">
                  <Link
                    href={`/${item.toLowerCase().replace(" ", "-")}`} // Proper URL formatting
                    className="px-3 py-2 text-[15px] font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    onMouseEnter={() => setActiveItem(item)}
                    onMouseLeave={() => setActiveItem("")}
                  >
                    {item}
                    {activeItem === item && (
                      <motion.div
                        layoutId="navbar-underline"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-6">
              {/* Search Bar */}
              <div className="hidden md:block">
                <SearchBar />
              </div>

              {/* Auth Section */}
              {!isLoggedIn ? (
                <div className="hidden md:flex items-center gap-4">
                  <button
                    onClick={() => {
                      setAuthMode("signin");
                      setIsAuthModalOpen(true);
                    }}
                    className="flex items-center px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    Sign In
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode("signup");
                      setIsAuthModalOpen(true);
                    }}
                    className="px-5 py-2.5 font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg transition-all"
                  >
                    Get Started
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-blue-500">
                        <Image
                          src="/default-avatar.png"
                          alt="Profile"
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                      />
                    </div>
                  </motion.button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            Signed in as
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            john.doe@example.com
                          </p>
                        </div>
                        <div className="py-1">
                          {["Your Profile", "Settings", "Dashboard"].map(
                            (item) => (
                              <Link
                                key={item}
                                href={`/${item
                                  .toLowerCase()
                                  .replace(" ", "-")}`}
                                className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                {item}
                              </Link>
                            )
                          )}
                        </div>
                        <div className="border-t border-gray-100">
                          <button
                            onClick={() => setIsLoggedIn(false)}
                            className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                          >
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-50"
              >
                <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
                  <motion.span
                    animate={
                      isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }
                    }
                    className="block w-full h-0.5 bg-gray-600 origin-center transition-transform"
                  />
                  <motion.span
                    animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                    className="block w-full h-0.5 bg-gray-600"
                  />
                  <motion.span
                    animate={
                      isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }
                    }
                    className="block w-full h-0.5 bg-gray-600 origin-center transition-transform"
                  />
                </div>
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden overflow-hidden bg-white rounded-lg mt-2 border border-gray-100 shadow-sm"
              >
                <div className="px-2 py-3 space-y-1">
                  {navItems.map((item) => (
                    <motion.div
                      key={item}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href={`/${item.toLowerCase().replace(" ", "-")}`}
                        className="block px-4 py-2.5 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50"
                      >
                        {item}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default Navbar;
