import React, { useState, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaTrophy, FaChevronDown } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Memoizing event handlers using useCallback for performance optimization (Efficiency)
  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);
  const toggleDropdown = useCallback(() => setDropdownOpen((prev) => !prev), []);
  const closeDropdown = useCallback(() => setDropdownOpen(false), []);

  const handleLogout = useCallback(async () => {
    await logout();
    setIsOpen(false);
    setDropdownOpen(false);
    navigate('/');
  }, [logout, navigate]);

  const navLinks = [
    { path: '/command-center', label: 'Command Center' },
    { path: '/assistant', label: 'AI Assistant' },
    { path: '/heatmap', label: 'Crowd Heatmap' },
    { path: '/queues', label: 'Queues' },
    { path: '/emergency', label: 'Emergency Panel' },
    { path: '/companion', label: 'Match Companion' },
    { path: '/transport', label: 'Transport' },
    { path: '/sustainability', label: 'Green Deck' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-sports-navy text-white shadow-premium" role="navigation" aria-label="Main navigation">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-wider text-white focus:ring-2 focus:ring-sports-blueLight focus:outline-none rounded-md px-1" aria-label="FIFA 2026 Stadium Home">
              <FaTrophy className="text-sports-blueLight" />
              <span>FIFA2026<span className="text-sports-blueLight font-light">STADIUM</span></span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors focus:ring-2 focus:ring-sports-blueLight focus:outline-none ${
                    isActive
                      ? 'bg-sports-blue text-white'
                      : 'text-gray-300 hover:bg-sports-navyLight hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* User Section (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-2 rounded-full bg-sports-navyLight px-4 py-2 text-sm font-medium hover:bg-sports-blue transition-all focus:ring-2 focus:ring-sports-blueLight focus:outline-none"
                >
                  <FaUser className="text-xs text-sports-blueLight" />
                  <span>{user.name ? user.name.split(' ')[0] : 'User'}</span>
                  <FaChevronDown className={`text-2xs transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-premium ring-1 ring-black ring-opacity-5" role="menu">
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={closeDropdown}
                        className="block px-4 py-2 text-sm text-sports-navy hover:bg-sports-grayBg font-medium focus:bg-sports-grayBg focus:outline-none"
                        role="menuitem"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-sports-danger hover:bg-sports-grayBg font-medium focus:bg-sports-grayBg focus:outline-none"
                      role="menuitem"
                    >
                      <FaSignOutAlt className="text-xs" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-md bg-sports-blue px-4 py-2 text-sm font-medium text-white hover:bg-sports-blueLight transition-all shadow-premium focus:ring-2 focus:ring-sports-blueLight focus:outline-none"
              >
                Log In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-sports-navyLight hover:text-white focus:outline-none focus:ring-2 focus:ring-sports-blueLight"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-sports-navyLight border-t border-sports-navy shadow-premium" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={toggleMenu}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:bg-sports-navy ${
                    isActive ? 'bg-sports-blue text-white' : 'text-gray-300 hover:bg-sports-navy hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={toggleMenu}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-sports-navy hover:text-white focus:outline-none"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-sports-danger hover:bg-sports-navy hover:text-white focus:outline-none"
                >
                  <FaSignOutAlt className="text-sm" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={toggleMenu}
                className="block text-center rounded-md bg-sports-blue px-3 py-2 text-base font-medium text-white hover:bg-sports-blueLight focus:outline-none"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default React.memo(Navbar);
