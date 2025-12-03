// First, make sure you have installed: npm install mapbox-gl
// Then create this component

import React, { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Clock, X, Building2 } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// IMPORTANT: Add this worker fix for Vite
import MapboxWorker from "mapbox-gl/dist/mapbox-gl-csp-worker?worker";
mapboxgl.workerClass = MapboxWorker;

mapboxgl.accessToken =
  "pk.eyJ1Ijoic3FzaGl2IiwiYSI6ImNtZXR1bzNmMDAwODIybnB3ZHV0cHBsNGMifQ.VOH_QGRij1H-UwPxcN_iHw";

const MapboxMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selected, setSelected] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  // Change this to your actual location
  const center = [-74.006, 40.7128]; // New York
  // For Pune, use: const center = [73.8567, 18.5204];

  const locations = [
    {
      id: 1,
      name: "Main Dining",
      coordinates: [-74.008, 40.7148],
      color: "#ef4444",
      icon: "🍽️",
    },
    {
      id: 2,
      name: "Cafe",
      coordinates: [-74.004, 40.7108],
      color: "#f59e0b",
      icon: "☕",
    },
    {
      id: 3,
      name: "Cocktail Lounge",
      coordinates: [-74.009, 40.7118],
      color: "#8b5cf6",
      icon: "🍸",
    },
    {
      id: 4,
      name: "Social Clubs",
      coordinates: [-74.003, 40.7138],
      color: "#10b981",
      icon: "👥",
    },
    {
      id: 5,
      name: "Wellness Center",
      coordinates: [-74.007, 40.7098],
      color: "#06b6d4",
      icon: "🧘",
    },
  ];

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center,
      zoom: 15,
    });

    map.current.on("load", () => {
      setMapLoaded(true);

      // Add location markers
      locations.forEach((loc) => {
        const el = document.createElement("div");
        el.className = "marker";
        el.style.backgroundColor = loc.color;
        el.textContent = loc.icon;
        el.onclick = () => handleSelect(loc);

        new mapboxgl.Marker(el).setLngLat(loc.coordinates).addTo(map.current);
      });

      // Center building marker
      const centerEl = document.createElement("div");
      centerEl.className = "center-marker";
      centerEl.textContent = "🏢";
      new mapboxgl.Marker(centerEl).setLngLat(center).addTo(map.current);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const calcDistance = (a, b) => {
    const R = 6371;
    const dLat = ((b[1] - a[1]) * Math.PI) / 180;
    const dLon = ((b[0] - a[0]) * Math.PI) / 180;
    const hav =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(a[1] * (Math.PI / 180)) *
        Math.cos(b[1] * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;
    return (R * 2 * Math.atan2(Math.sqrt(hav), Math.sqrt(1 - hav))).toFixed(2);
  };

  const handleSelect = (loc) => {
    setSelected(loc);
    const dist = calcDistance(center, loc.coordinates);
    setDistance(dist);
    setDuration(Math.ceil((dist / 5) * 60));
    map.current?.flyTo({
      center: loc.coordinates,
      zoom: 16,
      duration: 1500,
    });
  };

  const reset = () => {
    setSelected(null);
    setDistance(null);
    setDuration(null);
    map.current?.flyTo({ center, zoom: 15, duration: 1500 });
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-80 bg-white shadow-xl overflow-y-auto flex-shrink-0">
        <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Building2 className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold">Over Building</h1>
          </div>
          <p className="text-blue-200 text-sm">
            Select an amenity to view details
          </p>
        </div>

        {/* Selected Section */}
        {selected && (
          <div className="p-4 bg-blue-50 border-b-2 border-blue-200">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex justify-center items-center text-2xl shadow-md"
                  style={{ backgroundColor: selected.color }}
                >
                  {selected.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{selected.name}</h3>
                  <p className="text-xs text-gray-600">Currently viewing</p>
                </div>
              </div>
              <button
                onClick={reset}
                className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Navigation className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-gray-500">
                    Distance
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-900">{distance} km</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-gray-500">
                    Walk Time
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {duration} min
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Amenity List */}
        <div className="p-4">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Amenities
          </h2>
          <div className="space-y-2">
            {locations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => handleSelect(loc)}
                className={`w-full p-4 rounded-xl flex items-center gap-3 border-2 transition-all ${
                  selected?.id === loc.id
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
              >
                <div
                  className="w-12 h-12 rounded-full flex justify-center items-center text-2xl shadow-sm"
                  style={{
                    backgroundColor:
                      selected?.id === loc.id ? loc.color : `${loc.color}30`,
                  }}
                >
                  {loc.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900">{loc.name}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>Click to navigate</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAP */}
      <div className="flex-1 relative">
        <div
          ref={mapContainer}
          className="absolute inset-0 w-full h-full"
          style={{ minHeight: "100vh" }}
        />

        {!mapLoaded && (
          <div className="absolute inset-0 flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="p-8 bg-white rounded-xl shadow-xl text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-700 font-semibold text-lg">
                Loading map...
              </p>
              <p className="text-gray-500 text-sm mt-2">Please wait</p>
            </div>
          </div>
        )}
      </div>

      {/* Marker Styles */}
      <style>{`
        .marker {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          font-size: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 3px solid white;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          transition: transform 0.2s ease;
        }
        .marker:hover {
          transform: scale(1.2);
          z-index: 10;
        }

        .center-marker {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          font-size: 28px;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 4px solid white;
          cursor: pointer;
          box-shadow: 0 6px 16px rgba(30, 64, 175, 0.5);
        }
      `}</style>
    </div>
  );
};

export default MapboxMap;
