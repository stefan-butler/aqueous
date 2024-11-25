import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoic3RlZmFuYnV0bGVyIiwiYSI6ImNtM3d1eW96eTEzYnIycnBjYTJmanN3N3UifQ.KZCD_zLjFLshjXREHsvFyQ'; // replace with env file 


function Map() {
  const mapContainerRef = useRef<HTMLDivElement>(null); // Use a ref to access the map container

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Mapbox map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current, 
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [-1.5, 54.0], // Longitude, Latitude for the UK
      zoom: 5,
    });

    // Cleanup on component unmount
    return () => map.remove();
  }, []);

  return <div ref={mapContainerRef} style={{ width: '900px', height: '800px' }} />;
}

export default Map;