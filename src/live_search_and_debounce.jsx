import { useState, useEffect, useMemo, useRef } from "react";
import { WEATHER_API } from "./utils/api";

const LiveSearchAndDebounce = () => {
  const [query, setQuery] = useState("");
  const [debounceValue, setDebounceValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const wrapperRef = useRef(null);

  // debounce input
  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setDebounceValue(query);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // filtered results
  const filterData = useMemo(() => {
    if (!debounceValue) return [];

    return WEATHER_API.filter((item) =>
      item.city.toLowerCase().includes(debounceValue.toLowerCase())
    );
  }, [debounceValue]);

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "250px" }}>
      <input
        type="text"
        value={query}
        placeholder="Enter city..."
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true); // open dropdown when typing
        }}
        onFocus={() => {
          if (query) setIsOpen(true); // reopen on focus if text exists
        }}
      />

      {loading && <p>Loading...</p>}

      {isOpen && filterData.length > 0 && (
        <ul>
          {filterData.map((item) => (
            <li
              key={item.id}
              onClick={() => {
                setQuery(item.city);
                setIsOpen(false);
              }}
              style={{ padding: "5px", cursor: "pointer" }}
            >
              {item.city} - {item.temp}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LiveSearchAndDebounce;