import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { EnvironmentalData } from "../types";

interface AirQualityMapProps {
  envData: EnvironmentalData;
}

export const AirQualityMap: React.FC<AirQualityMapProps> = ({ envData }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const lat = envData.location.latitude;
  const lon = envData.location.longitude;
  const aqi = envData.air_quality.aqi;
  const color = envData.air_quality.color;
  const stationName = envData.data_provenance.station.name;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // If map instance exists, update view
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lon], 12);
      return;
    }

    // Initialize Leaflet map
    const map = L.map(mapContainerRef.current, {
      center: [lat, lon],
      zoom: 12,
      scrollWheelZoom: false
    });
    mapInstanceRef.current = map;

    // OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map);

    // Monitoring Station marker with custom HTML icon
    const stationIcon = L.divIcon({
      className: "custom-station-pin",
      html: `
        <div style="background-color: ${color}; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);">
          ${aqi}
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const marker = L.marker([lat, lon], { icon: stationIcon }).addTo(map);
    const category = envData.air_quality.category;
    const pm25Val = envData.air_quality.pollutants.pm2_5.value;
    const freshness = envData.data_provenance.station.freshness_minutes;

    marker.bindPopup(`
      <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
        <strong style="color: #163323; display: block; margin-bottom: 2px;">${stationName}</strong>
        <div>AQI: <strong style="color: ${color};">${aqi} (${category})</strong></div>
        <div>PM2.5: <strong>${pm25Val} µg/m³</strong></div>
        <div style="color: #666; font-size: 10px; margin-top: 4px;">Updated: ${freshness}m ago</div>
      </div>
    `).openPopup();

    // Semi-transparent pollution dispersion boundary circle
    L.circle([lat, lon], {
      color: color,
      fillColor: color,
      fillOpacity: 0.15,
      radius: 4000
    }).addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [lat, lon, aqi, color, stationName, envData.air_quality.category, envData.air_quality.pollutants.pm2_5.value, envData.data_provenance.station.freshness_minutes]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#e2e8e0] shadow-xs">
      <div ref={mapContainerRef} className="h-72 w-full z-0" />
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs p-2.5 rounded-xl shadow-xs border border-gray-200 text-xs z-10 pointer-events-none">
        <div className="flex items-center space-x-1.5 font-bold text-gray-800">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
          <span>Regional Dispersion Buffer (4 km)</span>
        </div>
        <div className="text-[10px] text-gray-500 mt-0.5">
          Nearest Station: {envData.data_provenance.station.distance_km} km
        </div>
      </div>
    </div>
  );
};
