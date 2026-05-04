import {useState, useEffect, useMemo} from 'react';
import { WEATHER_API } from './utils/api';

const LiveSearchAndDebounce =()=>{
  const [query, setQuery] = useState("");
  const [debounce, setDebounce] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    setLoading(true);
    const timer= setTimeout(()=>{
      setDebounce(query);
      setLoading(false);
    },400)
    return ()=> clearTimeout(timer);
  }, [query])


  const filterWeather = useMemo(()=>{
    if(!debounce) return [];
    const search = debounce.toLowerCase()
    return  WEATHER_API.filter((item) =>
    item.city.toLowerCase().includes(search)
  );
  }, [debounce])
  

  return (
    <>
     <input type="text" placeholder= "enter the city...." value={query} onChange={(e)=>{setQuery(e.target.value)}} />
     <ul>
      {filterWeather.map((item)=>{
        return <li key={item.id}>{item.city} - {item.temp}</li>
      })}
     </ul>
     <p>{loading ? "Loading" : ""} </p>

    </>
  )

}
export default LiveSearchAndDebounce;


