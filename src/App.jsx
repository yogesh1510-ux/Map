import Sidebar from "./components/Sidebar";
import Map from "./components/Map";
import Mapbox from "./components/mapbox";
import { useState } from "react";

export default function App() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="h-screen w-screen flex">
      <Mapbox />
    </div>
  );
}
