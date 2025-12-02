import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";

const container = { width: "100%", height: "100%" };
const origin = { lat: 18.5204, lng: 73.8567 }; // your building

export default function Map({ selected }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "YOUR_API_KEY",
  });

  const [map, setMap] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    if (map && selected) {
      map.panTo({ lat: selected.lat, lng: selected.lng });
      map.setZoom(16);
      calculateDistance(selected);
    }
  }, [selected, map]);

  const calculateDistance = (place) => {
    const service = new window.google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [{ lat: place.lat, lng: place.lng }],
        travelMode: "DRIVING",
      },
      (res) => {
        const info = res.rows[0].elements[0];
        setDistance(info.distance.text);
        setDuration(info.duration.text);
      }
    );
  };

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={container}
      center={origin}
      zoom={15}
      onLoad={(mapInstance) => setMap(mapInstance)}
    >
      <Marker position={origin} label="Origin" />

      {selected && (
        <>
          <Marker position={{ lat: selected.lat, lng: selected.lng }} />
          <InfoWindow position={{ lat: selected.lat, lng: selected.lng }}>
            <div className="text-sm">
              <p className="font-semibold">{selected.name}</p>
              <p>Distance: {distance}</p>
              <p>Time: {duration}</p>
            </div>
          </InfoWindow>
        </>
      )}
    </GoogleMap>
  );
}
