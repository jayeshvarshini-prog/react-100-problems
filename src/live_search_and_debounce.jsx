import React, {useState, useEffect, useMemo} from 'react';
import { WEATHER_API } from './utils/api';

export default function App(){
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [debounce, setDebounce] = useState("");

    useEffect(()=>{
        setLoading(true);
        const timer= setTimeout(()=>{
            setDebounce(query)
            setLoading(false);
        })
        return ()=> clearTimeout(timer)
    },[query])
    
    const filterClimate = useEffect(()=>{
        return WEATHER_API.filter((country)=>{
            const search = debounce.toLowerCase()
            return country.city.toLowerCase().includes(search);       
        })

    },[debounce])

    return(

        <>
        <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="type the city.."/>
        <p>{loading ? "loading" : ""}  </p>
        <ul>
            {filterClimate.map((items)=>{
                return <li key={items.id}>{items.city} - {items.temp}</li>
            }
            )}
        </ul>
        </>
    )
}