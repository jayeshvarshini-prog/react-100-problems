import { useState, useEffect } from 'react';
import { WEATHER_API } from './utils/api';

export default function LiveSearchAndDebounce() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      const searchResults = WEATHER_API.filter(item =>
        item.city.toLowerCase().includes(query.toLowerCase())
      );
      setResults(searchResults);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div style={{ padding: '20px' }}>
      <div className="search-box">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a city (e.g. London)..."
          style={{ padding: '8px 12px', fontSize: '14px', width: '300px', borderRadius: '6px', border: '1px solid #444', background: '#111', color: '#eee' }}
        />
        {loading && <span style={{ marginLeft: 8, color: '#aaa' }}>Loading...</span>}
      </div>

      <ul style={{ marginTop: 12, listStyle: 'none', padding: 0 }}>
        {results.map((item, index) => (
          <li key={index} style={{ padding: '6px 0', borderBottom: '1px solid #2a2a2a', cursor: 'pointer' }}
            onClick={() => console.log(item)}>
            {item.city} — {item.temp}°C
          </li>
        ))}
        {query && results.length === 0 && !loading && (
          <li style={{ color: '#888' }}>No results found</li>
        )}
      </ul>
    </div>
  );
}
