import { useEffect, useState } from "react";

export function useGoogleMaps() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places) {
        clearInterval(interval);
        setLoaded(true);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return loaded;
}
