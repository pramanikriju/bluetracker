"use client";

import React, { useEffect, useState } from "react";
import { DUMMY_CARBON_DATA } from "@/data/sea-carbon-data";
import { standardFormat } from "@/lib/format-number";
import dynamic from "next/dynamic";

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("react-leaflet").then((mod) => mod.Tooltip),
  { ssr: false }
);

// Custom heat layer component
const HeatLayer = dynamic(
  () => import("react-leaflet").then((mod) => {
    const L = require('leaflet');
    require('leaflet.heat');
    
    const HeatmapLayer = ({ points, options }: { points: [number, number, number][]; options?: any }) => {
      const map = mod.useMap();
      
      React.useEffect(() => {
        if (points && points.length > 0) {
          const heatLayer = (L as any).heatLayer(points, {
            radius: 25,
            blur: 15,
            maxZoom: 17,
            gradient: {
              0.0: '#000080',
              0.2: '#0000FF', 
              0.4: '#00FFFF',
              0.6: '#00FF00',
              0.8: '#FFFF00',
              1.0: '#FF0000'
            },
            ...options
          }).addTo(map);
          
          return () => {
            map.removeLayer(heatLayer);
          };
        }
      }, [map, points, options]);
      
      return null;
    };
    
    return HeatmapLayer;
  }),
  { ssr: false }
);

// Define detailed coastal areas with multiple data points per region - GLOBAL COVERAGE
const COASTAL_DATA_POINTS = [
  // EUROPE
  // North Atlantic - Iceland/Faroe Islands coast
  { name: 'North Atlantic', coords: [64.5, -22.0], intensity: 0 }, // Iceland SW coast
  { name: 'North Atlantic', coords: [65.2, -18.5], intensity: 0 }, // Iceland S coast  
  { name: 'North Atlantic', coords: [62.0, -7.0], intensity: 0 }, // Faroe Islands
  { name: 'North Atlantic', coords: [60.5, -1.0], intensity: 0 }, // Shetland Islands
  
  // Norwegian Sea - Norway's coast
  { name: 'Norwegian Sea', coords: [69.7, 18.9], intensity: 0 }, // Tromsø area
  { name: 'Norwegian Sea', coords: [67.3, 14.4], intensity: 0 }, // Bodø area
  { name: 'Norwegian Sea', coords: [63.4, 10.4], intensity: 0 }, // Trondheim area
  { name: 'Norwegian Sea', coords: [62.5, 6.2], intensity: 0 }, // Ålesund area
  { name: 'Norwegian Sea', coords: [60.4, 5.3], intensity: 0 }, // Bergen area
  
  // Baltic Sea - Multiple coastal areas
  { name: 'Baltic Sea', coords: [59.9, 10.8], intensity: 0 }, // Oslo fjord
  { name: 'Baltic Sea', coords: [59.3, 18.1], intensity: 0 }, // Stockholm archipelago
  { name: 'Baltic Sea', coords: [60.2, 24.9], intensity: 0 }, // Helsinki area
  { name: 'Baltic Sea', coords: [56.7, 16.3], intensity: 0 }, // Kalmar coast
  { name: 'Baltic Sea', coords: [55.6, 12.6], intensity: 0 }, // Copenhagen area
  { name: 'Baltic Sea', coords: [54.3, 13.1], intensity: 0 }, // Rügen area
  { name: 'Baltic Sea', coords: [54.9, 23.9], intensity: 0 }, // Kaliningrad coast
  
  // Celtic Sea - Ireland/Wales/Cornwall coasts
  { name: 'Celtic Sea', coords: [51.9, -10.3], intensity: 0 }, // SW Ireland
  { name: 'Celtic Sea', coords: [52.1, -6.3], intensity: 0 }, // SE Ireland
  { name: 'Celtic Sea', coords: [51.6, -5.1], intensity: 0 }, // Pembrokeshire
  { name: 'Celtic Sea', coords: [50.1, -5.5], intensity: 0 }, // Cornwall
  { name: 'Celtic Sea', coords: [50.7, -4.4], intensity: 0 }, // Devon coast
  
  // Bay of Biscay - Spain/France Atlantic coast
  { name: 'Bay of Biscay', coords: [43.5, -8.1], intensity: 0 }, // Galicia
  { name: 'Bay of Biscay', coords: [43.4, -3.8], intensity: 0 }, // Cantabria
  { name: 'Bay of Biscay', coords: [43.3, -1.8], intensity: 0 }, // Basque coast
  { name: 'Bay of Biscay', coords: [44.5, -1.2], intensity: 0 }, // Landes coast
  { name: 'Bay of Biscay', coords: [47.3, -2.8], intensity: 0 }, // Brittany
  
  // Mediterranean West - Spain/France coast
  { name: 'Mediterranean West', coords: [42.3, 3.2], intensity: 0 }, // Costa Brava
  { name: 'Mediterranean West', coords: [41.4, 2.2], intensity: 0 }, // Barcelona coast
  { name: 'Mediterranean West', coords: [39.6, 2.6], intensity: 0 }, // Mallorca
  { name: 'Mediterranean West', coords: [38.9, -0.1], intensity: 0 }, // Valencia coast
  { name: 'Mediterranean West', coords: [43.3, 6.9], intensity: 0 }, // French Riviera
  { name: 'Mediterranean West', coords: [43.1, 5.9], intensity: 0 }, // Marseille area
  
  // Adriatic Sea - Italy/Croatia coast
  { name: 'Adriatic Sea', coords: [45.4, 12.3], intensity: 0 }, // Venice area
  { name: 'Adriatic Sea', coords: [44.1, 15.2], intensity: 0 }, // Zadar area
  { name: 'Adriatic Sea', coords: [43.5, 16.4], intensity: 0 }, // Split area
  { name: 'Adriatic Sea', coords: [42.6, 18.1], intensity: 0 }, // Dubrovnik area
  { name: 'Adriatic Sea', coords: [41.3, 19.8], intensity: 0 }, // Albanian coast
  { name: 'Adriatic Sea', coords: [40.6, 18.2], intensity: 0 }, // Puglia coast
  
  // Aegean Sea - Greece/Turkey coast
  { name: 'Aegean Sea', coords: [39.4, 26.3], intensity: 0 }, // Lesbos area
  { name: 'Aegean Sea', coords: [37.9, 27.3], intensity: 0 }, // Samos area
  { name: 'Aegean Sea', coords: [36.4, 28.2], intensity: 0 }, // Rhodes area
  { name: 'Aegean Sea', coords: [37.0, 25.4], intensity: 0 }, // Naxos area
  { name: 'Aegean Sea', coords: [38.4, 23.1], intensity: 0 }, // Attica coast
  { name: 'Aegean Sea', coords: [39.6, 22.9], intensity: 0 }, // Chalkidiki

  // AFRICA - West Coast
  { name: 'West Africa', coords: [14.7, -17.4], intensity: 0 }, // Dakar, Senegal
  { name: 'West Africa', coords: [6.3, -10.8], intensity: 0 }, // Monrovia, Liberia
  { name: 'West Africa', coords: [5.6, -0.2], intensity: 0 }, // Accra, Ghana
  { name: 'West Africa', coords: [6.5, 3.4], intensity: 0 }, // Lagos, Nigeria
  { name: 'West Africa', coords: [4.0, 9.7], intensity: 0 }, // Douala, Cameroon
  { name: 'West Africa', coords: [-8.8, 13.2], intensity: 0 }, // Luanda, Angola
  { name: 'West Africa', coords: [-15.1, 12.0], intensity: 0 }, // Walvis Bay, Namibia
  { name: 'West Africa', coords: [-33.9, 18.4], intensity: 0 }, // Cape Town, South Africa
  
  // AFRICA - East Coast
  { name: 'East Africa', coords: [-1.3, 36.8], intensity: 0 }, // Mombasa, Kenya
  { name: 'East Africa', coords: [-6.8, 39.3], intensity: 0 }, // Dar es Salaam, Tanzania
  { name: 'East Africa', coords: [-25.9, 32.6], intensity: 0 }, // Maputo, Mozambique
  { name: 'East Africa', coords: [-29.9, 31.0], intensity: 0 }, // Durban, South Africa
  { name: 'East Africa', coords: [15.6, 32.5], intensity: 0 }, // Port Sudan, Sudan
  { name: 'East Africa', coords: [11.6, 43.1], intensity: 0 }, // Djibouti
  
  // AFRICA - North Coast
  { name: 'North Africa', coords: [36.8, 10.2], intensity: 0 }, // Tunis, Tunisia
  { name: 'North Africa', coords: [36.7, 3.1], intensity: 0 }, // Algiers, Algeria
  { name: 'North Africa', coords: [33.6, -7.6], intensity: 0 }, // Casablanca, Morocco
  { name: 'North Africa', coords: [31.2, 29.9], intensity: 0 }, // Alexandria, Egypt
  { name: 'North Africa', coords: [32.9, 13.2], intensity: 0 }, // Tripoli, Libya
  
  // ASIA - South Asia
  { name: 'South Asia', coords: [19.1, 72.9], intensity: 0 }, // Mumbai, India
  { name: 'South Asia', coords: [13.1, 80.3], intensity: 0 }, // Chennai, India
  { name: 'South Asia', coords: [22.3, 91.8], intensity: 0 }, // Chittagong, Bangladesh
  { name: 'South Asia', coords: [24.9, 67.0], intensity: 0 }, // Karachi, Pakistan
  { name: 'South Asia', coords: [6.9, 79.8], intensity: 0 }, // Colombo, Sri Lanka
  { name: 'South Asia', coords: [11.9, 75.2], intensity: 0 }, // Kochi, India
  { name: 'South Asia', coords: [15.3, 73.8], intensity: 0 }, // Goa, India
  
  // ASIA - Southeast Asia
  { name: 'Southeast Asia', coords: [1.3, 103.8], intensity: 0 }, // Singapore
  { name: 'Southeast Asia', coords: [3.1, 101.7], intensity: 0 }, // Kuala Lumpur area, Malaysia
  { name: 'Southeast Asia', coords: [13.8, 100.5], intensity: 0 }, // Bangkok area, Thailand
  { name: 'Southeast Asia', coords: [-6.2, 106.8], intensity: 0 }, // Jakarta, Indonesia
  { name: 'Southeast Asia', coords: [-8.1, 112.2], intensity: 0 }, // Surabaya, Indonesia
  { name: 'Southeast Asia', coords: [14.6, 121.0], intensity: 0 }, // Manila, Philippines
  { name: 'Southeast Asia', coords: [10.8, 106.7], intensity: 0 }, // Ho Chi Minh City, Vietnam
  { name: 'Southeast Asia', coords: [21.0, 105.8], intensity: 0 }, // Hanoi area, Vietnam
  { name: 'Southeast Asia', coords: [5.4, 100.3], intensity: 0 }, // Penang, Malaysia
  { name: 'Southeast Asia', coords: [1.5, 124.8], intensity: 0 }, // Manado, Indonesia
  
  // ASIA - East Asia
  { name: 'East Asia', coords: [31.2, 121.5], intensity: 0 }, // Shanghai, China
  { name: 'East Asia', coords: [22.3, 114.2], intensity: 0 }, // Hong Kong
  { name: 'East Asia', coords: [35.7, 139.7], intensity: 0 }, // Tokyo Bay, Japan
  { name: 'East Asia', coords: [34.7, 135.5], intensity: 0 }, // Osaka Bay, Japan
  { name: 'East Asia', coords: [35.1, 129.0], intensity: 0 }, // Busan, South Korea
  { name: 'East Asia', coords: [25.0, 121.5], intensity: 0 }, // Taipei, Taiwan
  
  // PACIFIC ISLANDS
  { name: 'Pacific Islands', coords: [-17.7, -149.4], intensity: 0 }, // Tahiti
  { name: 'Pacific Islands', coords: [-18.1, 178.4], intensity: 0 }, // Suva, Fiji
  { name: 'Pacific Islands', coords: [7.1, 171.4], intensity: 0 }, // Majuro, Marshall Islands
  { name: 'Pacific Islands', coords: [-9.4, 159.9], intensity: 0 }, // Honiara, Solomon Islands
  
  // INDIAN OCEAN
  { name: 'Indian Ocean', coords: [-4.6, 55.5], intensity: 0 }, // Port Louis, Mauritius
  { name: 'Indian Ocean', coords: [-20.3, 57.5], intensity: 0 }, // Réunion
  { name: 'Indian Ocean', coords: [4.2, 73.5], intensity: 0 }, // Malé, Maldives
  
  // AMERICAS - Caribbean & Central America
  { name: 'Caribbean', coords: [18.5, -69.9], intensity: 0 }, // Dominican Republic
  { name: 'Caribbean', coords: [18.0, -76.8], intensity: 0 }, // Jamaica
  { name: 'Caribbean', coords: [10.7, -61.5], intensity: 0 }, // Trinidad and Tobago
  { name: 'Caribbean', coords: [12.1, -61.7], intensity: 0 }, // Grenada
  { name: 'Caribbean', coords: [9.9, -84.1], intensity: 0 }, // Costa Rica Pacific
  
  // AMERICAS - South America
  { name: 'South America', coords: [-23.0, -43.2], intensity: 0 }, // Rio de Janeiro, Brazil
  { name: 'South America', coords: [-34.6, -58.4], intensity: 0 }, // Buenos Aires, Argentina
  { name: 'South America', coords: [-33.0, -71.6], intensity: 0 }, // Valparaíso, Chile
  { name: 'South America', coords: [10.5, -66.9], intensity: 0 }, // Caracas area, Venezuela
  { name: 'South America', coords: [-12.0, -77.0], intensity: 0 }, // Lima, Peru
  { name: 'South America', coords: [-2.2, -79.9], intensity: 0 }, // Guayaquil, Ecuador
  
  // MIDDLE EAST
  { name: 'Middle East', coords: [26.2, 50.6], intensity: 0 }, // Manama, Bahrain
  { name: 'Middle East', coords: [25.3, 51.5], intensity: 0 }, // Doha, Qatar
  { name: 'Middle East', coords: [25.2, 55.3], intensity: 0 }, // Dubai, UAE
  { name: 'Middle East', coords: [29.4, 48.0], intensity: 0 }, // Kuwait City
  { name: 'Middle East', coords: [36.2, 59.6], intensity: 0 }, // Bandar Abbas, Iran
];

export function CarbonDataMap() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate regional data for visualization
  const regionalData = DUMMY_CARBON_DATA
    .filter(item => item.carbonCapture.verification === 'verified')
    .reduce((acc, item) => {
      const region = item.location.regionName;
      if (!acc[region]) {
        acc[region] = {
          totalCapture: 0,
          fisherCount: new Set(),
          dataPoints: 0
        };
      }
      acc[region].totalCapture += item.carbonCapture.amount;
      acc[region].fisherCount.add(item.fisherId);
      acc[region].dataPoints += 1;
      return acc;
    }, {} as Record<string, { totalCapture: number; fisherCount: Set<string>; dataPoints: number }>);

  // Assign intensities to coastal points based on regional data
  const coastalPointsWithData = COASTAL_DATA_POINTS.map(point => {
    const regionData = regionalData[point.name];
    const baseIntensity = regionData?.totalCapture || 0;
    
    // Add some variation to create realistic heat patterns along coast
    const variation = (Math.random() - 0.5) * 0.3; // ±30% variation
    const pointIntensity = Math.max(0, baseIntensity * (1 + variation));
    
    return {
      ...point,
      intensity: pointIntensity,
      fisherCount: regionData?.fisherCount.size || 0,
      dataPoints: regionData?.dataPoints || 0
    };
  });

  // Create heat map data points [lat, lng, intensity]
  const heatMapPoints: [number, number, number][] = coastalPointsWithData
    .filter(point => point.intensity > 0)
    .map(point => [point.coords[0], point.coords[1], Math.min(point.intensity / 10, 1)]);

  // Convert to region summary for stats
  const mapRegions = Object.entries(regionalData).map(([regionName, data]) => ({
    name: regionName,
    totalCapture: data.totalCapture,
    fisherCount: data.fisherCount.size,
    dataPoints: data.dataPoints,
    intensity: data.totalCapture,
    // Get representative coordinates for the region
    center: coastalPointsWithData.find(p => p.name === regionName)?.coords || [0, 0]
  }));


  if (!isClient) {
    return (
      <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="mb-6">
          <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
            Carbon Collection Map
          </h2>
          <p className="text-sm text-dark-4 dark:text-dark-6">
            Loading interactive map...
          </p>
        </div>
        <div className="h-[500px] bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
          <span className="text-dark-4 dark:text-dark-6">🗺️ Loading Map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-6">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Global Carbon Collection Map
        </h2>
        <p className="text-sm text-dark-4 dark:text-dark-6">
          Worldwide interactive heat map of blue carbon data collection areas
        </p>
      </div>

      <div className="h-[500px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <MapContainer
          center={[20.0, 20.0]} // Center on Africa/Global view
          zoom={2}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          
          {/* Heat Layer */}
          {heatMapPoints.length > 0 && (
            <HeatLayer 
              points={heatMapPoints}
              options={{
                radius: 40,
                blur: 25,
                maxZoom: 12,
                gradient: {
                  0.0: 'rgba(0, 0, 0, 0)',        // Completely transparent
                  0.1: 'rgba(0, 0, 139, 0.6)',    // Dark blue
                  0.2: 'rgba(0, 0, 255, 0.8)',    // Bright blue
                  0.3: 'rgba(0, 191, 255, 0.85)',  // Deep sky blue
                  0.4: 'rgba(0, 255, 255, 0.9)',   // Cyan
                  0.5: 'rgba(0, 255, 127, 0.95)',  // Spring green
                  0.6: 'rgba(0, 255, 0, 1.0)',     // Bright green
                  0.7: 'rgba(255, 255, 0, 1.0)',   // Yellow
                  0.8: 'rgba(255, 165, 0, 1.0)',   // Orange
                  0.9: 'rgba(255, 69, 0, 1.0)',    // Red-orange
                  1.0: 'rgba(255, 0, 0, 1.0)'      // Bright red
                }
              }}
            />
          )}
          
          {/* Coastal marker points for interaction */}
          {coastalPointsWithData
            .filter(point => point.intensity > 0)
            .map((point, index) => (
            <CircleMarker
              key={`${point.name}-${index}`}
              center={point.coords as [number, number]}
              radius={4}
              fillColor="rgba(255, 255, 255, 0.8)"
              color="#1976D2"
              weight={1}
              opacity={0.9}
              fillOpacity={0.7}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg mb-2">{point.name}</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>Location:</strong> {point.coords[0].toFixed(3)}°, {point.coords[1].toFixed(3)}°</p>
                    <p><strong>Carbon Capture:</strong> {standardFormat(point.intensity)} tCO₂e</p>
                    <p><strong>Regional Total:</strong> {standardFormat(regionalData[point.name]?.totalCapture || 0)} tCO₂e</p>
                    <p><strong>Active Fishers:</strong> {point.fisherCount}</p>
                  </div>
                </div>
              </Popup>
              
              <Tooltip permanent={false} direction="top">
                <div className="text-center">
                  <div className="text-xs font-semibold">{point.name}</div>
                  <div className="text-xs">{standardFormat(point.intensity)} tCO₂e</div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Comprehensive Info Panel */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Legend & Instructions */}
        <div className="lg:col-span-1">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg h-full">
            <h4 className="text-lg font-semibold text-dark dark:text-white mb-3">Map Legend</h4>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <p className="text-sm font-medium text-dark dark:text-white">Heat Map Legend:</p>
                <div className="space-y-2">
                  <div className="h-6 w-full rounded-lg border border-gray-300 dark:border-gray-600" style={{
                    background: 'linear-gradient(to right, rgba(0,0,139,0.6), rgba(0,0,255,0.8), rgba(0,191,255,0.85), rgba(0,255,255,0.9), rgba(0,255,127,0.95), rgba(0,255,0,1.0), rgba(255,255,0,1.0), rgba(255,165,0,1.0), rgba(255,69,0,1.0), rgba(255,0,0,1.0))'
                  }}></div>
                  <div className="flex justify-between text-xs text-dark-4 dark:text-dark-6 font-medium">
                    <span>No Activity</span>
                    <span>Moderate</span>
                    <span>Very High</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-dark dark:text-white">Markers:</p>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full border-2 border-blue-600 bg-white"></div>
                  <span className="text-sm text-dark-4 dark:text-dark-6">Data Collection Points</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs text-dark-4 dark:text-dark-6">
                • Heat areas show carbon capture intensity globally
              </p>
              <p className="text-xs text-dark-4 dark:text-dark-6 mt-1">
                • White markers show individual collection sites
              </p>
              <p className="text-xs text-dark-4 dark:text-dark-6 mt-1">
                • Click markers for detailed location data
              </p>
              <p className="text-xs text-dark-4 dark:text-dark-6 mt-1">
                • Covers Africa, Asia, Americas, and global coastlines
              </p>
              <p className="text-xs text-dark-4 dark:text-dark-6 mt-1">
                • Zoom in to see more granular shore details
              </p>
            </div>
          </div>
        </div>

        {/* Regional Statistics */}
        <div className="lg:col-span-2">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg h-full">
            <h4 className="text-lg font-semibold text-dark dark:text-white mb-4">Regional Overview</h4>
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {mapRegions.filter(r => r.intensity > 0).length}
                </div>
                <div className="text-xs text-dark-4 dark:text-dark-6">Active Regions</div>
              </div>
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {mapRegions.reduce((sum, r) => sum + r.fisherCount, 0)}
                </div>
                <div className="text-xs text-dark-4 dark:text-dark-6">Total Fishers</div>
              </div>
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {coastalPointsWithData.filter(p => p.intensity > 0).length}
                </div>
                <div className="text-xs text-dark-4 dark:text-dark-6">Shore Points</div>
              </div>
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {standardFormat(mapRegions.reduce((sum, r) => sum + r.totalCapture, 0))}
                </div>
                <div className="text-xs text-dark-4 dark:text-dark-6">Total tCO₂e</div>
              </div>
            </div>

            {/* Top Performing Regions */}
            <div>
              <h5 className="text-sm font-semibold text-dark dark:text-white mb-2">Top Performing Regions</h5>
              <div className="space-y-2">
                {mapRegions
                  .filter(r => r.intensity > 0)
                  .sort((a, b) => b.totalCapture - a.totalCapture)
                  .slice(0, 3)
                  .map((region, index) => (
                    <div key={region.name} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium text-dark dark:text-white">{region.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-dark dark:text-white">
                          {standardFormat(region.totalCapture)} tCO₂e
                        </div>
                        <div className="text-xs text-dark-4 dark:text-dark-6">
                          {region.fisherCount} fishers
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
