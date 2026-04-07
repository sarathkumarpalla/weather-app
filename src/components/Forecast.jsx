import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Droplets, Wind, Thermometer } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { format, isSameDay } from 'date-fns';

const Forecast = ({ data, unit }) => {
  const [activeTab, setActiveTab] = useState('daily');
  const isCelsius = unit === 'celsius';

  if (!data) return null;

  const { hourly, daily } = data;

  // Filter hourly data for the next 24 hours
  const next24Hours = hourly.time.slice(0, 24).map((time, i) => {
    const temp = isCelsius 
      ? Math.round(hourly.temperature_2m[i]) 
      : Math.round((hourly.temperature_2m[i] * 9/5) + 32);
    
    return {
      time: new Date(time),
      temp,
      code: hourly.weather_code[i],
      humidity: hourly.relative_humidity_2m[i],
      wind: hourly.wind_speed_10m[i]
    };
  });

  // Daily data (7 days)
  const next7Days = daily.time.map((time, i) => {
    const maxTemp = isCelsius 
      ? Math.round(daily.temperature_2m_max[i]) 
      : Math.round((daily.temperature_2m_max[i] * 9/5) + 32);
    
    const minTemp = isCelsius
      ? Math.round(daily.temperature_2m_min[i])
      : Math.round((daily.temperature_2m_min[i] * 9/5) + 32);

    return {
      date: new Date(time),
      maxTemp,
      minTemp,
      code: daily.weather_code[i],
      uv: daily.uv_index_max[i]
    };
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-8 pb-12">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <TabButton 
          active={activeTab === 'daily'} 
          onClick={() => setActiveTab('daily')} 
          icon={<Calendar className="w-4 h-4" />} 
          label="7-Day Forecast" 
        />
        <TabButton 
          active={activeTab === 'hourly'} 
          onClick={() => setActiveTab('hourly')} 
          icon={<Clock className="w-4 h-4" />} 
          label="Next 24 Hours" 
        />
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'daily' ? (
          <motion.div
            key="daily"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 md:grid-cols-7 gap-4"
          >
            {next7Days.map((day, i) => (
              <motion.div 
                key={day.date.toISOString()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`glass-card p-4 flex md:flex-col items-center justify-between gap-4 md:gap-2 ${i === 0 ? 'border-primary-500/30 bg-primary-500/5' : ''}`}
              >
                <div className="text-center">
                  <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                    {i === 0 ? 'Today' : format(day.date, 'EEE')}
                  </span>
                  <p className="text-xs opacity-60 md:block hidden">
                    {format(day.date, 'd MMM')}
                  </p>
                </div>
                
                <WeatherIcon code={day.code} className="w-10 h-10 md:w-12 md:h-12" />
                
                <div className="flex md:flex-col items-center gap-1">
                  <span className="text-lg font-bold text-slate-800 dark:text-white">{day.maxTemp}°</span>
                  <span className="text-sm text-slate-500 dark:text-slate-500 font-medium">{day.minTemp}°</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="hourly"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x"
          >
            {next24Hours.map((hour, i) => (
              <div 
                key={hour.time.toISOString()}
                className="flex-shrink-0 w-28 glass-card p-4 flex flex-col items-center gap-3 snap-start"
              >
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                  {i === 0 ? 'Now' : format(hour.time, 'HH:mm')}
                </span>
                
                <WeatherIcon code={hour.code} className="w-10 h-10" />
                
                <span className="text-xl font-bold text-slate-800 dark:text-white">
                  {hour.temp}°
                </span>

                <div className="flex flex-col items-center gap-1 opacity-60 text-[10px] font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Droplets className="w-2.5 h-2.5 text-blue-400" /> {hour.humidity}%
                  </span>
                  <span className="flex items-center gap-1">
                    <Wind className="w-2.5 h-2.5 text-cyan-400" /> {hour.wind}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 border ${
      active 
      ? 'bg-primary-600 text-white border-primary-500 shadow-lg shadow-primary-600/30' 
      : 'glass bg-white/10 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 border-white/20 hover:bg-white/20 dark:hover:bg-slate-800/60'
    }`}
  >
    {icon}
    {label}
  </button>
);

export default Forecast;
