import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibWpzc2NvdHQiLCJhIjoiY20zeDlxcXUyMTh5dTJpcjB4Yjc1eW5nOSJ9.Nx_5dt3cM5eh78zPTxwmdw'; // replace with env file 


function Map() {
  const mapContainerRef = useRef<HTMLDivElement>(null); // Use a ref to access the map container

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Mapbox map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current, 
      style: 'mapbox://styles/mjsscott/cm3y9f5y300js01sdao5g8w2l',
      center: [-1.5, 54.0], // Longitude, Latitude for the UK
      zoom: 5,
    });

    map.on('load', () => {
      fetch('http://localhost:3000/api/geojson/active-warnings')
      .then(response => response.json())
      .then(data => {
        map.addSource('active-warnings', {
          type: 'geojson',
          data: data,
          generateId: true,
        });

        map.addLayer({
          id: 'active-warnings-heatmap',
          type: 'heatmap',
          source: 'active-warnings',
          paint: {
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 1,  // Lower intensity at lower zoom levels
              9, 3,  // Higher intensity at higher zoom levels
            ],
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, 'rgba(0, 0, 255, 0)',  // Blue for low density
              0.1, 'rgb(0, 255, 255)',  // Cyan for medium density
              0.3, 'rgb(255, 255, 0)',  // Yellow for higher density
              0.5, 'rgb(255, 0, 0)',    // Red for very high density
            ],
            'heatmap-radius': 30,  // Radius of influence for each point
            'heatmap-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 1,  // Full opacity for the heatmap at zoom level 0
              9, 0,  // Fade out to 0 opacity at zoom level 9 (or adjust based on your needs)
            ],
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'severityLevel'],
              1, 0.5, // Assign a lower weight for severity level 1
              2, 1,   // Assign a medium weight for severity level 2
              3, 2    // Assign a higher weight for severity level 3
            ],
          },
        });

        map.addLayer({
          id: 'active-warnings-layer',
          type: 'circle',
          source: 'active-warnings',
          paint: {
            "circle-radius": [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 2,  // Smaller circles at zoom level 0
              5, 8,  // Slightly larger circles at zoom level 5
              9, 20, // Larger circles at zoom level 9
            ],
            "circle-opacity": [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 0.2, // Low opacity at zoom level 0
              5, 0.5, // Medium opacity at zoom level 5
              9, 1,   // Full opacity at zoom level 9
            ],
            "circle-color": [
              'case',
              ['==', ['get', 'severityLevel'], 1], '#ff0000', // Red for severe
              ['==', ['get', 'severityLevel'], 2], '#ffa500', // Orange for warnings
              ['==', ['get', 'severityLevel'], 3], '#FFFF00', // Yellow for alerts
              '#00ff00', // Default green (no warnings)
            ],
          },
        });
        
      })
      .catch(error => console.error('Error fetching geojson data: ', error));
      
    });

    map.on('click', 'active-warnings-layer', (e) => {
      if (!e.features || e.features.length === 0) {
        return; // No features found at the clicked point
      }
      
      const feature = e.features[0];
    
      if (feature.geometry.type === 'Point') {
        const coordinates = feature.geometry.coordinates as [number, number];
        
        if (feature.properties) {
          const severityLevel = feature.properties.severityLevel;
          const message = feature.properties.message;
    
          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(`
              <div>
                <h3>Area Code: ${feature.properties.title}</h3>
                <p><strong>Severity Level:</strong> ${severityLevel}</p>
                <p><strong>Message:</strong> ${message}</p>
              </div>
            `)
            .addTo(map);
        } else {
          console.warn('Feature properties are missing: ', feature);
        } 
      } else {
        console.warn('Clicked feature is not a point: ', feature);
      }
    });

    // Cleanup on component unmount
    return () => map.remove();
  }, []);

  return <div ref={mapContainerRef} className='w-[900px] h-[800px] rounded-lg overflow-hidden' />;
}

export default Map;