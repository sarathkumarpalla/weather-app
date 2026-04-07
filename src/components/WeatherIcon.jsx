import React from 'react';
import { 
  Sun, 
  Cloud, 
  CloudDrizzle, 
  CloudRain, 
  CloudLightning, 
  CloudSnow, 
  CloudFog,
  Wind,
  CloudSun
} from 'lucide-react';

const WeatherIcon = ({ code, className = "w-12 h-12" }) => {
  // WMO Weather interpretation codes (WW)
  // https://open-meteo.com/en/docs
  const getIcon = (code) => {
    switch (code) {
      case 0: // Clear sky
        return <Sun className={`${className} text-yellow-400`} />;
      case 1: // Mainly clear
      case 2: // Partly cloudy
        return <CloudSun className={`${className} text-blue-300`} />;
      case 3: // Overcast
        return <Cloud className={`${className} text-slate-400`} />;
      case 45: // Fog
      case 48: // Depositing rime fog
        return <CloudFog className={`${className} text-slate-300`} />;
      case 51: // Drizzle: Light
      case 53: // Drizzle: Moderate
      case 55: // Drizzle: Dense intensity
      case 56: // Freezing Drizzle: Light
      case 57: // Freezing Drizzle: Dense intensity
        return <CloudDrizzle className={`${className} text-blue-400`} />;
      case 61: // Rain: Slight
      case 63: // Rain: Moderate
      case 65: // Rain: Heavy intensity
      case 66: // Freezing Rain: Light
      case 67: // Freezing Rain: Heavy intensity
      case 80: // Rain showers: Slight
      case 81: // Rain showers: Moderate
      case 82: // Rain showers: Violent
        return <CloudRain className={`${className} text-blue-500`} />;
      case 71: // Snow fall: Slight
      case 73: // Snow fall: Moderate
      case 75: // Snow fall: Heavy intensity
      case 77: // Snow grains
      case 85: // Snow showers: Slight
      case 86: // Snow showers: Heavy
        return <CloudSnow className={`${className} text-white`} />;
      case 95: // Thunderstorm: Slight or moderate
      case 96: // Thunderstorm with slight hail
      case 99: // Thunderstorm with heavy hail
        return <CloudLightning className={`${className} text-yellow-500`} />;
      default:
        return <Sun className={`${className} text-yellow-400`} />;
    }
  };

  return getIcon(code);
};

export const getWeatherDescription = (code) => {
  const descriptions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };
  return descriptions[code] || 'Unknown';
};

export default WeatherIcon;
