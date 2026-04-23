import React, {useState, useEffect, useMemo} from 'react';
import { WEATHER_API } from './utils/api';

export default function App (){
  
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false)
  const [debounce, setDebounce] = useState('');
  
  useEffect(()=>{
    setLoading(true)
    const timer=setTimeout(()=>{
        setDebounce(query);
        setLoading(false);
    },300)
     return ()=> clearTimeout(timer) //arrow function
  },[query]);

  const filterTemp = useMemo(()=>{
    if(!debounce) return []; //question?
    return WEATHER_API.filter((country)=>country.city.toLowerCase().includes(debounce.toLowerCase())); //carefull with the filter   
  },[debounce]); //mindfull of the dependency
   
  return(
    <>
      <input type="text" value={query} onChange= {(e)=>setQuery(e.target.value)} placeholder="enter the text..." /> 
      <p>{loading ? "loading.... " : ""}</p>
      <ul>
        {filterTemp.map((item)=>{ //don't  use debounce use filter
          return <li key={item.id}> {item.city} - {item.temp}</li>
        })}
      </ul>
      
    </>)
  
} 


