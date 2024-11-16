import React, { useState, useEffect } from 'react';
import './AddressAutocomplete.css';

type Place = {
  display_name: string;
  lat: string;
  lon: string;
};

type Props = {
  onSelect: (address: string, coords: [number, number]) => void;
};

export const AddressAutocomplete: React.FC<Props> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&limit=5`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch suggestions');
        }

        const data: Place[] = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (place: Place) => {
    const coords: [number, number] = [parseFloat(place.lat), parseFloat(place.lon)];
    onSelect(`${coords[0]},${coords[1]}`, coords);
    setQuery(place.display_name);
    setSuggestions([]);
  };

  return (
    <div className="address-autocomplete">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a destination"
        className="address-input"
      />
      {loading && <div className="loading">Loading...</div>}
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((place, index) => (
            <li
              key={index}
              onClick={() => handleSelect(place)}
              className="suggestion-item"
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
