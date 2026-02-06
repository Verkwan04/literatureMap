import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { BookLocation, Language } from '../types';

interface LiteraryMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  locations: BookLocation[];
  onLocationSelect: (loc: BookLocation) => void;
  language: Language;
}

const LiteraryMap: React.FC<LiteraryMapProps> = ({ center, zoom, locations, onLocationSelect, language }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Initialize Map
  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([center.lat, center.lng], zoom);

      // Vintage-styled tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        className: 'vintage-map-layer',
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      L.control.zoom({ position: 'topright' }).addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update View
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([center.lat, center.lng], zoom, {
        duration: 2.5,
        easeLinearity: 0.25
      });
    }
  }, [center, zoom]);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    locations.forEach(loc => {
        const bookTitle = loc.bookTitle[language] || loc.bookTitle.en;
        
        // Custom Ink Pin Icon with PERMANENT LABEL
        const inkIcon = L.divIcon({
            className: 'bg-transparent',
            html: `
              <div class="relative cursor-pointer -translate-x-1/2 -translate-y-full hover:z-50">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="drop-shadow-lg transition-transform hover:-translate-y-1 mx-auto">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#c5a059" stroke="#2a2a2a" stroke-width="1.5"/>
                  <circle cx="12" cy="9" r="2.5" fill="#2a2a2a"/>
                </svg>
                <div class="bg-parchment-100 border border-ink-600 px-2 py-0.5 rounded shadow-md mt-1 whitespace-nowrap text-center text-ink-900 text-[10px] font-bold font-serif max-w-[150px] overflow-hidden text-ellipsis opacity-90 hover:opacity-100">
                   ${bookTitle}
                </div>
              </div>
            `,
            iconSize: [40, 70], // Increased height to accommodate label
            iconAnchor: [20, 40]
        });

        const marker = L.marker([loc.lat, loc.lng], { icon: inkIcon })
            .addTo(mapInstanceRef.current!)
            .on('click', () => onLocationSelect(loc));
        
        markersRef.current.push(marker);
    });
  }, [locations, onLocationSelect, language]);

  return (
    <div className="w-full h-full relative z-0">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};

export default LiteraryMap;
