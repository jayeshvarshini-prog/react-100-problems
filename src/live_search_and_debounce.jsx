import {useState, useEffect, useMemo} from 'react';
import { WEATHER_API } from './utils/api';

export default function App(){
  const [query, setQuery] = useState("");
  const [debounce, setDebounce] = useState("");
  const [loading, setLoading] = useState(false);

 useEffect(()=>{
  setLoading(true);
  const timer = setTimeout(()=>{
      setDebounce(query);
      setLoading(false);
  },300)

  return ()=> clearTimeout (timer);
 },[query])  

  const filterData = useMemo(()=>{
    if(!debounce) return [];
    const search = debounce.toLowerCase();
    return WEATHER_API.filter((item)=>{
      return item.city.toLowerCase().includes(debounce);
    })
  },[debounce])

  return(
    <>
      <input
        type="text"
        value={query}
        placeholder="enter the text... "
        onChange={(e)=>setQuery(e.target.value)}
      />
      <p>{loading ? "loading.. ": ""}</p>
      <ul>
        {filterData.map((item)=>(
          <li key={item.id}>{item.city} - {item.temp}</li>
        ))}
      </ul>
    </>
  )
}