export default function PlaceItem({ place, onSelect }) {
  return (
    <button
      onClick={() => onSelect(place)}
      className="block text-left w-full px-2 py-1 rounded hover:bg-gray-200"
    >
      {place.name}
    </button>
  );
}
