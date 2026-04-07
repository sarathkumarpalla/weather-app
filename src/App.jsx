import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import Forecast from './components/Forecast';
import Loader from './components/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [cityData, setCityData] = useState(JSON.parse(localStorage.getItem('lastCity')) || { name: 'London', latitude: 51.5074, longitude: -0.1278 });
  const [unit, setUnit] = useState(localStorage.getItem('unit') || 'celsius');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initial fetch
    fetchWeatherData(cityData.latitude, cityData.longitude);
    
    // Check for saved theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Geolocation once on load if no saved city
  useEffect(() => {
    if (!localStorage.getItem('lastCity')) {
      handleLocationClick();
    }
  }, []);

  const fetchWeatherData = async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,pressure_msl,surface_pressure,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&timezone=auto&forecast_days=7`
      );
      setWeatherData(response.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (city) => {
    setCityData(city);
    localStorage.setItem('lastCity', JSON.stringify(city));
    fetchWeatherData(city.latitude, city.longitude);
  };

  const handleUnitToggle = () => {
    const newUnit = unit === 'celsius' ? 'fahrenheit' : 'celsius';
    setUnit(newUnit);
    localStorage.setItem('unit', newUnit);
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCityData({ name: 'Current Location', latitude, longitude });
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.error("Location error:", error);
          setError("Location access denied.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  // Dynamic Background based on weather code
  const getBackgroundStyles = (code) => {
    if (!code && code !== 0) return 'bg-[#f0f4f8] dark:bg-[#0f172a]';
    
    // Map WMO codes to background gradients
    if (code === 0 || code === 1) return 'bg-gradient-to-br from-blue-400 via-sky-300 to-amber-100 dark:from-slate-900 dark:via-blue-900/40 dark:to-slate-900'; // Sunny
    if (code === 2 || code === 3) return 'bg-gradient-to-br from-blue-400 via-slate-300 to-slate-400 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900'; // Cloudy
    if (code >= 51 && code <= 67 || code >= 80 && code <= 82) return 'bg-gradient-to-br from-slate-600 via-blue-500 to-indigo-400 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950'; // Rain
    if (code >= 71 && code <= 77 || code === 85 || code === 86) return 'bg-gradient-to-br from-blue-100 via-sky-100 to-white dark:from-slate-900 dark:via-blue-900/30 dark:to-blue-800/10'; // Snow
    if (code >= 95) return 'bg-gradient-to-br from-slate-800 via-purple-900 to-indigo-900 dark:from-black dark:via-purple-950 dark:to-indigo-950'; // Storm
    
    return 'bg-gradient-to-br from-blue-500 to-sky-400 dark:from-slate-900 dark:to-slate-800'; // Default
  };

  return (
    <div className={`min-h-screen relative transition-all duration-1000 ${getBackgroundStyles(weatherData?.current.weather_code)}`}>
      
      {/* Decorative Blur Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-400/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px] animate-pulse-slow" />
      </div>

      <div className="relative z-10 pt-8 md:pt-12">
        <SearchBar 
          onSearch={handleSearch} 
          unit={unit} 
          onUnitToggle={handleUnitToggle}
          theme={theme}
          onThemeToggle={handleThemeToggle}
          onLocationClick={handleLocationClick}
        />

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto px-4 mb-8"
            >
              <div className="p-4 bg-red-500/20 border border-red-500/30 backdrop-blur-md rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{error}</span>
                <button onClick={() => fetchWeatherData(cityData.latitude, cityData.longitude)} className="ml-auto underline flex items-center gap-1 text-sm">
                  <RefreshCw className="w-3 h-3" /> Retry
                </button>
              </div>
            </motion.div>
          )}

          {loading && <Loader />}

          {!loading && weatherData && (
            <motion.div
              key={cityData.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <WeatherCard 
                data={weatherData} 
                unit={unit} 
                city={cityData.name} 
              />
              <Forecast 
                data={weatherData} 
                unit={unit} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="w-full text-center py-8 text-slate-500 dark:text-slate-500 text-sm font-medium">
          <p>© {new Date().getFullYear()} WeatherApp Premium • Frontend Portfolio Pro</p>
          <p className="mt-1 text-xs opacity-60">Powered by Open-Meteo API</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
