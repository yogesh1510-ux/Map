import React, { useState, useRef, useEffect } from "react";
import { MapPin, Navigation, Clock, X } from "lucide-react";

const MAPBOX_TOKEN = "pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example"; // You'll need to add your token

const MapboxMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef({});
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  // Central building coordinates (example: New York)
  const centerBuilding = {
    name: "Over Building",
    coordinates: [-74.006, 40.7128],
    type: "center",
  };

  // Amenities around the center
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

    // Initialize map
    const mapboxgl = window.mapboxgl;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: centerBuilding.coordinates,
      zoom: 14,
    });

    map.current.on("load", () => {
      // Add center building marker
      const centerEl = document.createElement("div");
      centerEl.className = "center-marker";
      centerEl.innerHTML = "🏢";

      new mapboxgl.Marker(centerEl)
        .setLngLat(centerBuilding.coordinates)
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<strong>${centerBuilding.name}</strong>`
          )
        )
        .addTo(map.current);

      // Add location markers
      locations.forEach((location) => {
        const el = document.createElement("div");
        el.className = "location-marker";
        el.style.backgroundColor = location.color;
        el.innerHTML = location.icon;

        const marker = new mapboxgl.Marker(el)
          .setLngLat(location.coordinates)
          .addTo(map.current);

        markers.current[location.id] = marker;
      });
    });
  }, []);

  const calculateDistance = (coord1, coord2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((coord2[1] - coord1[1]) * Math.PI) / 180;
    const dLon = ((coord2[0] - coord1[0]) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((coord1[1] * Math.PI) / 180) *
        Math.cos((coord2[1] * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location);

    // Calculate distance
    const dist = calculateDistance(
      centerBuilding.coordinates,
      location.coordinates
    );
    setDistance(dist);

    // Estimate duration (assuming 5 km/h walking speed)
    const dur = Math.ceil((dist / 5) * 60);
    setDuration(dur);

    // Fly to location
    if (map.current) {
      map.current.flyTo({
        center: location.coordinates,
        zoom: 16,
        duration: 2000,
      });
    }
  };

  const resetView = () => {
    setSelectedLocation(null);
    setDistance(null);
    setDuration(null);

    if (map.current) {
      map.current.flyTo({
        center: centerBuilding.coordinates,
        zoom: 14,
        duration: 2000,
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg overflow-y-auto">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <h1 className="text-2xl font-bold mb-2">Over Building</h1>
          <p className="text-blue-100 text-sm">
            Select an amenity to view details
          </p>
        </div>

        {/* Selected Location Info */}
        {selectedLocation && (
          <div className="p-4 bg-blue-50 border-b border-blue-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedLocation.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedLocation.name}
                  </h3>
                  <p className="text-xs text-gray-500">Currently viewing</p>
                </div>
              </div>
              <button
                onClick={resetView}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Navigation className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="text-xs text-gray-500">Distance</div>
                  <div className="font-semibold text-gray-900">
                    {distance} km
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="text-xs text-gray-500">Walk Time</div>
                  <div className="font-semibold text-gray-900">
                    {duration} min
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Locations List */}
        <div className="p-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Amenities
          </h2>
          <div className="space-y-2">
            {locations.map((location) => (
              <button
                key={location.id}
                onClick={() => handleLocationClick(location)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selectedLocation?.id === location.id
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${location.color}20` }}
                  >
                    {location.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {location.name}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <MapPin className="w-3 h-3" />
                      <span>Tap to navigate</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapContainer} className="w-full h-full" />

        {/* Map overlay message */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> Add your Mapbox token to see the map
          </p>
        </div>
      </div>

      <style jsx>{`
        .center-marker {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #1e40af;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
          border: 3px solid white;
        }

        .location-marker {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          border: 2px solid white;
          transition: transform 0.2s;
        }

        .location-marker:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default MapboxMap;
