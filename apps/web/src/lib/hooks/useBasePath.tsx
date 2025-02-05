import { useState, useEffect } from "react";

export function useBasePath() {
  const [basePath, setBasePath] = useState("");

  useEffect(() => {
		setBasePath(window.location.host);
  }, []);
      
  return basePath;
}