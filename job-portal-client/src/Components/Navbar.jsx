import React, { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleMenuOpen = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
    };

    const navItems = [
        { path: "/", title: "Find Jobs" },
        { path: "/salary", title: "Salary Guide" },
        { path: "/about", title: "About Us" },
        { path: "/contact", title: "Contact" }
    ];

    // Dashboard link based on user role
    const getDashboardLink = () => {
        if (!isAuthenticated || !user) return "/login";

        switch(user.role) {
            case 'admin':
                return "/dashboard";
            case 'company':
                return "/company-dashboard";
            case 'applicant':
                return "/applicant-dashboard";
            default:
                return "/applicant-dashboard";
        }
    };

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
            <div className="container-custom">
                <nav className='flex justify-between items-center'>
                    {/* Logo */}
                    <Link to="/" className='flex items-center gap-2 text-2xl font-bold'>
                        <svg
                            xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                            viewBox="0 0 29 30" fill="none" className="transition-transform duration-300 hover:scale-110">
                            <circle cx="12.0143" cy="12.5143" r="12.0143" fill="#2563EB" fillOpacity="0.4" />
                            <circle cx="16.9857" cy="17.4857" r="12.0143" fill="#2563EB" />
                        </svg>
                        <span className={`${scrolled ? 'text-gray-900' : 'text-gray-900'} font-display`}>CareerHub</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <ul className='hidden md:flex gap-8'>
                        {navItems.map(({ path, title }) => (
                            <li key={path}>
                                <NavLink
                                    to={path}
                                    className={({ isActive }) =>
                                        `text-base font-medium transition-colors duration-200 hover:text-brand-600 ${isActive ? "active" : scrolled ? "text-gray-800" : "text-gray-800"}`
                                    }
                                >
                                    {title}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    {/* Auth Buttons */}
                    <div className='hidden md:flex items-center gap-4'>
                        {isAuthenticated && user ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    to={getDashboardLink()}
                                    className="btn btn-sm btn-outline flex items-center gap-2"
                                >
                                    <i className="fas fa-user-circle"></i>
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-sm btn-primary"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-sm btn-outline">
                                    Sign In
                                </Link>
                                <Link to="/signup" className="btn btn-sm btn-primary">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={handleMenuOpen}
                        className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                    >
                        {isMenuOpen ? (
                            <i className="fas fa-times"></i>
                        ) : (
                            <i className="fas fa-bars"></i>
                        )}
                    </button>
                </nav>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
                >
                    <div className="bg-white rounded-lg shadow-lg p-4">
                        <ul className="space-y-3">
                            {navItems.map(({ path, title }) => (
                                <li key={path}>
                                    <NavLink
                                        to={path}
                                        className={({ isActive }) =>
                                            `block py-2 px-4 rounded-md transition-colors duration-200 ${isActive ? "bg-brand-50 text-brand-600" : "text-gray-700 hover:bg-gray-50"}`
                                        }
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {title}
                                    </NavLink>
                                </li>
                            ))}

                            {isAuthenticated && user ? (
                                <>
                                    <li>
                                        <Link
                                            to={getDashboardLink()}
                                            className="block py-2 px-4 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsMenuOpen(false);
                                            }}
                                            className="block w-full text-left py-2 px-4 rounded-md text-red-600 hover:bg-red-50 transition-colors duration-200"
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link
                                            to="/login"
                                            className="block py-2 px-4 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Sign In
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/signup"
                                            className="block py-2 px-4 rounded-md bg-brand-600 text-white hover:bg-brand-700 transition-colors duration-200"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Sign Up
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar
