import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Sun, Moon, Thermometer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const SearchBar = ({ 
  onSearch, 
  unit, 
  onUnitToggle, 
  theme, 
  onThemeToggle,
  onLocationClick
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (val) => {
    if (val.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${val}&count=5&language=en&format=json`);
      setSuggestions(res.data.results || []);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Geocoding error:", err);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    // Simple debounce
    const timeoutId = setTimeout(() => fetchSuggestions(val), 500);
    return () => clearTimeout(timeoutId);
  };

  const handleSelect = (city) => {
    setQuery(`${city.name}, ${city.country || ''}`);
    setShowSuggestions(false);
    onSearch(city);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8">
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Search Input Container */}
        <div className="relative flex-1 w-full" ref={dropdownRef}>
          <form onSubmit={handleSubmit} className="relative group">
            <input
              type="text"
              value={query}
              onChange={handleChange}
              placeholder="Search city..."
              className="w-full h-14 pl-12 pr-4 glass-card bg-white/10 dark:bg-slate-900/40 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all rounded-2xl"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors w-5 h-5" />
          </form>

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 glass-card bg-white/90 dark:bg-slate-900/90 overflow-hidden z-40 rounded-2xl border border-white/20 shadow-2xl"
              >
                {suggestions.map((city, index) => (
                  <button
                    key={`${city.id}-${index}`}
                    onClick={() => handleSelect(city)}
                    className="w-full px-6 py-3 text-left hover:bg-primary-500/10 dark:hover:bg-primary-500/20 text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-3 border-b border-white/10 last:border-0"
                  >
                    <MapPin className="w-4 h-4 text-primary-500" />
                    <div>
                      <span className="font-medium">{city.name}</span>
                      <span className="text-sm opacity-60 ml-2">{city.admin1}, {city.country}</span>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLocationClick}
            className="p-4 glass-card bg-primary-500/10 dark:bg-primary-500/20 text-primary-500 rounded-2xl hover:bg-primary-500/20 dark:hover:bg-primary-500/30 transition-all"
            title="Current Location"
          >
            <MapPin className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onUnitToggle}
            className="p-4 glass-card bg-white/10 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 rounded-2xl flex items-center gap-2 px-5"
          >
            <Thermometer className="w-5 h-5 text-orange-500" />
            <span className="font-bold">°{unit === 'celsius' ? 'C' : 'F'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onThemeToggle}
            className="p-4 glass-card bg-white/10 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 rounded-2xl"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-blue-600" />}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
