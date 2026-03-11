import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dcontext } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { Menu, X, Box, User, Map, Activity, Truck, Leaf, Sun, Moon, LogIn, LogOut, ScanLine } from 'lucide-react';

const Header = () => {
    const { isManufacturer, isAdmin, isAuth, isDriver } = useContext(Dcontext);
    const { isDarkMode, toggleTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const isActive = (path) => location.pathname === path;

    const NavItem = ({ to, label, icon: Icon }) => (
        <li className="nav-item">
            <Link
                to={to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-300 whitespace-nowrap ${isActive(to)
                    ? 'bg-[#2E7D32] text-white shadow-md'
                    : 'text-gray-600 hover:text-[#2E7D32] hover:bg-green-50'
                    }`}
            >
                {Icon && <Icon size={18} />}
                <span className="font-medium">{label}</span>
            </Link>
        </li>
    );

    if (isAdmin === null || isManufacturer === null || isAuth === null) {
        return <></>; // handled by loading page
    }

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-background/90 backdrop-blur-lg border-b border-green-100 dark:border-white/10 shadow-sm' : 'bg-transparent pt-4'
            }`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2E7D32] to-[#4CAF50] flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                            <Leaf className="text-white" size={24} />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2E7D32] to-[#1B5E20]">
                            Agri<span className="text-[#4CAF50]">SupplyTrack</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center justify-end flex-grow">
                        <ul className="flex items-center gap-1">
                            <NavItem to="/" label="Dashboard" icon={Activity} />

                            {isManufacturer && (
                                <>
                                    <NavItem to="/create-shipment" label="Log Shipment" icon={Box} />
                                    <NavItem to="/produce" label="Produce" icon={Truck} />
                                </>
                            )}

                            {isAuth && (
                                <>
                                    <NavItem to="/geo" label="Geo Tracking" icon={Map} />
                                    <NavItem to="/geo2" label="Geomap" icon={Map} />
                                </>
                            )}

                            {(isDriver || isAdmin) && (
                                <NavItem to="/checkpoint" label="Checkpoint" icon={ScanLine} />
                            )}

                            {isAdmin && (
                                <>
                                    <NavItem to="/create-user" label="Add User" icon={User} />
                                    <NavItem to="/user-list" label="Users" />
                                    <NavItem to="/device-list" label="Devices" />
                                    <NavItem to="/produce-list" label="Produce List" />
                                </>
                            )}

                            {!isAuth ? (
                                <NavItem to="/login" label="Login" icon={LogIn} />
                            ) : (
                                <li className="nav-item ml-2">
                                    <button
                                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all font-medium"
                                        onClick={() => {
                                            fetch(`${process.env.REACT_APP_BACKEND_URL}/logout`, { credentials: 'include' })
                                                .then(() => { window.location.href = '/login'; })
                                                .catch(() => { window.location.href = '/login'; });
                                        }}
                                    >
                                        <LogOut size={18} />
                                        <span>Logout</span>
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>

                    <div className="flex items-center gap-2 lg:hidden">
                        {/* Dark Mode Toggle (Mobile) */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#2E7D32] transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#2E7D32]"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    <div className="hidden lg:flex items-center gap-4">
                        {/* Dark Mode Toggle (Desktop) */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 ml-4 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-[#2E7D32] dark:hover:text-primary-light transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className={`lg:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-screen opacity-100 py-4 border-t border-green-50 dark:border-white/10 bg-white dark:bg-background' : 'max-h-0 opacity-0'
                    }`}>
                    <ul className="flex flex-col gap-2">
                        <NavItem to="/" label="Dashboard" icon={Activity} />

                        {isManufacturer && (
                            <>
                                <NavItem to="/create-shipment" label="Log Shipment" icon={Box} />
                                <NavItem to="/produce" label="Produce" icon={Truck} />
                            </>
                        )}

                        {isAuth && (
                            <NavItem to="/geo" label="Geo Tracking" icon={Map} />
                        )}

                        {isAdmin && (
                            <>
                                <NavItem to="/checkpoint" label="Checkpoint" icon={ScanLine} />
                                <NavItem to="/create-user" label="Add User" icon={User} />
                                <NavItem to="/user-list" label="Users" />
                                <NavItem to="/device-list" label="Devices" />
                                <NavItem to="/produce-list" label="Produce List" />
                            </>
                        )}

                        {(isDriver) && (
                            <NavItem to="/checkpoint" label="Checkpoint" icon={ScanLine} />
                        )}

                        {!isAuth ? (
                            <NavItem to="/login" label="Login" icon={LogIn} />
                        ) : (
                            <li className="nav-item mt-2">
                                <button
                                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all font-medium"
                                    onClick={() => {
                                        fetch(`${process.env.REACT_APP_BACKEND_URL}/logout`, { credentials: 'include' })
                                            .then(() => { window.location.href = '/login'; })
                                            .catch(() => { window.location.href = '/login'; });
                                    }}
                                >
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;