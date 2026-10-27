import React, { useState } from 'react';
import {
  Activity,
  Search,
  Calendar,
  FlaskConical,
  BookOpen,
  User,
  Sun,
  Moon,
  MessageCircle,
  Menu,
  X,
  MapPin,
  ChevronDown,
  Stethoscope
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';
import { useChat } from '../context/ChatContext.tsx';
import { City } from '../types/index.ts';

interface NavbarProps {
  selectedCity: City;
  onSelectCity: (city: City) => void;
  onOpenLogin: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

const CITIES: City[] = ['Bangalore', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune'];

export const Navbar: React.FC<NavbarProps> = ({
  selectedCity,
  onSelectCity,
  onOpenLogin,
  activeSection,
  onNavigate,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { openChat } = useChat();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Activity },
    { id: 'doctors', label: 'Find Doctors', icon: Stethoscope },
    { id: 'appointments', label: 'Book Appointments', icon: Calendar },
    { id: 'lab-tests', label: 'Lab Tests', icon: FlaskConical },
    { id: 'health-info', label: 'Health Library', icon: BookOpen },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & City Selector */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-teal-700 via-cyan-700 to-blue-700 dark:from-teal-400 dark:via-cyan-300 dark:to-blue-400 bg-clip-text text-transparent">
                  CarePulse
                </span>
                <span className="block text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase -mt-1">
                  Bangalore Healthcare
                </span>
              </div>
            </button>

            {/* City Location Picker */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setCityDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>{selectedCity}</span>
                {selectedCity === 'Bangalore' ? (
                  <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    Live
                  </span>
                ) : (
                  <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    Soon
                  </span>
                )}
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {cityDropdownOpen && (
                <div className="absolute left-0 mt-1 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1.5 z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select City
                  </div>
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        onSelectCity(city);
                        setCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        selectedCity === city
                          ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-medium'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{city}</span>
                        {city === 'Bangalore' ? (
                          <span className="text-[9px] px-1.5 py-0.2 font-bold rounded-sm bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Active
                          </span>
                        ) : (
                          <span className="text-[9px] px-1.5 py-0.2 font-medium rounded-sm bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                            Working Soon
                          </span>
                        )}
                      </div>
                      {selectedCity === city && <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-80" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Assistant Quick Pill */}
            <button
              onClick={() => openChat()}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-teal-500/30 hover:shadow-teal-500/40 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 animate-bounce" />
              <span className="hidden sm:inline">Ask AI Assistant</span>
              <span className="sm:hidden">AI Chat</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Login Button */}
            <button
              onClick={onOpenLogin}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Login / Register</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Navigation Menu"
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <div className="pt-2 pb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5">
              Select City
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    onSelectCity(city);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2 text-xs rounded-lg text-left font-medium flex items-center justify-between ${
                    selectedCity === city
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <span>{city}</span>
                  {city === 'Bangalore' && (
                    <span className="text-[9px] px-1 rounded bg-emerald-500 text-white font-bold">Live</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                    activeSection === item.id
                      ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              Login or Create Account
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
