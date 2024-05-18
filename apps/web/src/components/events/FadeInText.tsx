"use client"

import { useEffect, useState } from "react";


export default function FadeInText(){
    const [loaded,setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    },[]);

    return (
      <h1
        className={`font-bold text-4xl text-center transition-opacity ease-in duration-600 ${loaded ? "opacity-100" : "opacity-0"} pt-7`}>
        Check Out What ACM Has Planned!
      </h1>
    );
}
