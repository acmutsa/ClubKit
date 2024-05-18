"use client"

import { useEffect, useState } from "react";


export default function FadeInText(){
    const [loaded,setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    },[]);

    return (
      <h1
        className={`font-bold text-4xl md:text-5xl text-center transition ease-in duration-700 ${loaded ? "opacity-100 -translate-y-4" : "opacity-0"} pt-10 w-full`}>
       Upcoming Events
      </h1>
    );
}
