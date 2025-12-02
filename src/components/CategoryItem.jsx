import { useState } from "react";
import PlaceItem from "./PlaceItem";

export default function CategoryItem({ category, onSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between bg-white p-2 rounded shadow"
      >
        {category.category}
        <span>{open ? "-" : "+"}</span>
      </button>

      {open && (
        <div className="ml-4 mt-2">
          {category.items.map((p, i) => (
            <PlaceItem key={i} place={p} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}
