import { MenuIcon, XIcon, LogOutIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { navlinks } from "../data/navlinks";
import type { INavLink } from "../types";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogoutClick = async () => {
    await logout();
    navigate("/");
    setIsOpen(false);
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur bg-background/60 border-b border-white/5"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
      >
        <Link to="/">
          <img src="/logo.svg" alt="logo" className="h-8 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8 transition duration-500">
          <Link to="/" className="text-text-secondary hover:text-primary transition font-medium">
            Home
          </Link>
          <Link to="/generate" className="text-text-secondary hover:text-primary transition font-medium">
            Generate
          </Link>
          <Link to="/my-generation" className="text-text-secondary hover:text-primary transition font-medium">
            My Generations
          </Link>
          <a href="#about" className="text-text-secondary hover:text-primary transition font-medium">
            About
          </a>
        </div>

        {isAuthenticated ? (
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700">
              <UserIcon size={14} className="text-secondary" />
              <span className="text-xs font-semibold text-text-primary">{user?.name}</span>
            </div>
            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-750 active:scale-95 border border-slate-700 transition-all rounded-full text-xs font-medium text-text-primary"
            >
              <LogOutIcon size={14} />
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="hidden md:block px-6 py-2.5 bg-primary hover:bg-primary/90 active:scale-95 transition-all text-white font-medium rounded-full text-sm shadow-lg shadow-primary/20"
          >
            Get Started
          </button>
        )}
        <button onClick={() => setIsOpen(true)} className="md:hidden">
          <MenuIcon size={26} className="active:scale-90 transition text-text-primary" />
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-100 bg-background/95 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-400 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link onClick={() => setIsOpen(false)} to="/" className="text-text-primary font-medium hover:text-primary">
          Home
        </Link>
        <Link onClick={() => setIsOpen(false)} to="/generate" className="text-text-primary font-medium hover:text-primary">
          Generate
        </Link>
        <Link onClick={() => setIsOpen(false)} to="/my-generation" className="text-text-primary font-medium hover:text-primary">
          My Generations
        </Link>
        <a onClick={() => setIsOpen(false)} href="#about" className="text-text-primary font-medium hover:text-primary">
          About
        </a>
        
        {isAuthenticated ? (
          <div className="flex flex-col items-center gap-4">
            <span className="text-sm font-semibold text-text-secondary">Logged in as {user?.name}</span>
            <button
              onClick={handleLogoutClick}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-750 active:scale-95 border border-slate-750 transition-all rounded-full text-sm text-text-primary"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            onClick={() => setIsOpen(false)}
            to="/login"
            className="px-6 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-full text-sm font-medium"
          >
            Get Started
          </Link>
        )}

        <button
          onClick={() => setIsOpen(false)}
          className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-primary hover:bg-primary/95 transition text-white rounded-md flex"
        >
          <XIcon />
        </button>
      </div>
    </>
  );
}
