import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Droplets, Thermometer, MapPin, Calendar, Clock, Sun } from 'lucide-react';
import WeatherIcon, { getWeatherDescription } from './WeatherIcon';
import { format } from 'date-fns';

const WeatherCard = ({ data, unit, city }) => {
  if (!data) return null;

  const { current, daily } = data;
  const isCelsius = unit === 'celsius';
  
  const currentTemp = isCelsius 
    ? Math.round(current.temperature_2m) 
    : Math.round((current.temperature_2m * 9/5) + 32);
    
  const feelsLike = isCelsius
    ? Math.round(current.apparent_temperature)
    : Math.round((current.apparent_temperature * 9/5) + 32);

  const highTemp = isCelsius
    ? Math.round(daily.temperature_2m_max[0])
    : Math.round((daily.temperature_2m_max[0] * 9/5) + 32);

  const lowTemp = isCelsius
    ? Math.round(daily.temperature_2m_min[0])
    : Math.round((daily.temperature_2m_min[0] * 9/5) + 32);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto px-4"
    >
      <div className="glass-card overflow-hidden p-8 relative flex flex-col md:flex-row gap-8 items-center md:items-stretch">
        
        {/* Background glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[100px] -z-10 rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10 rounded-full" />

        {/* Left Section: Main Temp and Icon */}
        <div className="flex-1 flex flex-col items-center md:items-start justify-center">
          <div className="flex items-center gap-3 mb-2 text-slate-600 dark:text-slate-400">
            <MapPin className="w-4 h-4 text-primary-500" />
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white truncate max-w-[250px]">
              {city || 'Unknown Location'}
            </h2>
          </div>
          
          <div className="flex items-center gap-3 mb-6 text-slate-500 dark:text-slate-400 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{format(new Date(), 'EEEE, d MMM')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{format(new Date(), 'HH:mm')}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 mb-4">
            <WeatherIcon code={current.weather_code} className="w-24 h-24 md:w-32 md:h-32 drop-shadow-2xl" />
            <div className="flex flex-col">
              <span className="text-7xl md:text-8xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">
                {currentTemp}°
              </span>
              <span className="text-lg md:text-xl font-medium text-slate-600 dark:text-slate-300 mt-2">
                {getWeatherDescription(current.weather_code)}
              </span>
            </div>
          </div>
          
          <div className="flex gap-4 text-slate-600 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <span className="opacity-60 text-xs uppercase">High:</span> {highTemp}°
            </span>
            <span className="flex items-center gap-1">
              <span className="opacity-60 text-xs uppercase">Low:</span> {lowTemp}°
            </span>
          </div>
        </div>

        {/* Vertical Divider (Desktop) */}
        <div className="hidden md:block w-px bg-white/20 dark:bg-slate-700/50 self-stretch my-4" />

        {/* Right Section: Details Grid */}
        <div className="w-full md:w-72 grid grid-cols-2 md:grid-cols-1 gap-4 py-2">
          <DetailItem 
            icon={<Thermometer className="w-5 h-5 text-orange-500" />} 
            label="Feels Like" 
            value={`${feelsLike}°`} 
          />
          <DetailItem 
            icon={<Droplets className="w-5 h-5 text-blue-500" />} 
            label="Humidity" 
            value={`${current.relative_humidity_2m}%`} 
          />
          <DetailItem 
            icon={<Wind className="w-5 h-5 text-cyan-500" />} 
            label="Wind Speed" 
            value={`${current.wind_speed_10m} km/h`} 
          />
          <DetailItem 
            icon={<Sun className="w-5 h-5 text-yellow-500" />} 
            label="UV Index" 
            value={daily.uv_index_max[0]} 
          />
        </div>
      </div>
    </motion.div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 glass rounded-2xl border-white/10">
    <div className="p-2 bg-white/5 dark:bg-white/5 rounded-xl">
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider">{label}</span>
      <span className="text-lg font-bold text-slate-800 dark:text-white">{value}</span>
    </div>
  </div>
);

export default WeatherCard;
