import {useState, useEffect, useMemo, useRef} from 'react';
import { WEATHER_API } from './utils/api';

const LiveSearchAndDebounce = ()=>{
  const [query, setQuery] = useState("");
  const [debounce, setDebounce] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
   const wrapperRef = useRef(null);

 useEffect(()=>{
  setLoading(true);
  const timer = setTimeout(()=>{
      setDebounce(query);
      setLoading(false);
  },400)
  return ()=> clearTimeout (timer);
 },[query])  

  useEffect(()=>{
    const handleClickOutside = (event)=>{
    if  (wrapperRef.current && !wrapperRef.current.contains(event.target)){
      setIsOpen(false);
    }
    }
    document.addEventListener("mousedown",handleClickOutside);
     return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  },[])

  const filterData = useMemo(()=>{
    if(!debounce) return [];
    const search = debounce.toLowerCase();
    return WEATHER_API.filter((item)=>{
      return item.city.toLowerCase().includes(search);
    })
  },[debounce])


  return(
    <>
      <input
        type="text"
        value={query}
        placeholder="enter the text... "
        onChange={(e)=>{setQuery(e.target.value); setIsOpen(!!e.target.value);} }
        
      />
      <p>{loading ? "loading.. ": ""}</p>
      <div ref={wrapperRef}>
        {isOpen && (
  <ul>
    {filterData.map((item) => (
      <li key={item.id}>
        {item.city} - {item.temp}
      </li>
    ))}
  </ul>
)}
      </div>
      
    </>
  )
}

export default LiveSearchAndDebounce;