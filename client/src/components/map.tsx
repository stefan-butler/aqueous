import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapUI  from './mapUI'
mapboxgl.accessToken = 'pk.eyJ1IjoibWpzc2NvdHQiLCJhIjoiY20zeDlxcXUyMTh5dTJpcjB4Yjc1eW5nOSJ9.Nx_5dt3cM5eh78zPTxwmdw'; // replace with env file 

const Map = () => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null); 
  const mapContainerRef = useRef<HTMLDivElement>(null); 

  const getSeverityDescription = (severityLevel: number): string => {
    switch (severityLevel) {
      case 1:
        return 'Severe Flooding, Danger to Life.';
      case 2:
        return 'Flooding is Expected, Immediate Action Required.';
      case 3:
        return 'Flooding is Possible, Be Prepared.';
      default:
        return 'Unknown severity level.';
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Mapbox map
    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mjsscott/cm3y9f5y300js01sdao5g8w2l',
      center: [-1.5, 54.0], // Longitude, Latitude for the UK
      zoom: 5,
    });

    mapInstance.on('load', () => {
      fetch('http://localhost:3000/api/geojson/active-warnings')
        .then(response => response.json())
        .then(data => {
          mapInstance.addSource('active-warnings', {
            type: 'geojson',
            data: data,
            generateId: true,
          });

          mapInstance.addLayer({
            id: 'heatmap',
            type: 'heatmap',
            source: 'active-warnings',
            paint: {
              'heatmap-intensity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 1,
                9, 3,
              ],
              'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0, 'rgba(0, 0, 255, 0)',
                0.1, 'rgb(0, 255, 255)',
                0.3, 'rgb(255, 255, 0)',
                0.5, 'rgb(255, 0, 0)',
              ],
              'heatmap-radius': 30,
              'heatmap-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 1,
                9, 0,
              ],
              'heatmap-weight': [
                'interpolate',
                ['linear'],
                ['get', 'severityLevel'],
                1, 0.5,
                2, 1,
                3, 2,
              ],
            },
          });

          mapInstance.addLayer({
            id: 'active-warnings',
            type: 'circle',
            source: 'active-warnings',
            paint: {
              "circle-radius": [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 2,
                5, 8,
                9, 20,
              ],
              "circle-opacity": [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 0.2,
                5, 0.5,
                9, 1,
              ],
              "circle-color": [
                'case',
                ['==', ['get', 'severityLevel'], 1], '#ff0000',
                ['==', ['get', 'severityLevel'], 2], '#ffa500',
                ['==', ['get', 'severityLevel'], 3], '#FFFF00',
                '#00ff00',
              ],
            },
          });

          mapInstance.on('click', 'active-warnings', (e) => {
             if (!e.features || e.features.length === 0) {
             return;
            }
             const feature = e.features[0];

            if (feature.geometry.type === 'Point') {
            const coordinates = feature.geometry.coordinates as [number, number];

            if (feature.properties) {
            const severityLevel = feature.properties.severityLevel;
            const severityDescription = getSeverityDescription(severityLevel);
            const message = feature.properties.message;
            
            new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(`
            <div>
            <h3>Area Code: ${feature.properties.title}</h3>
            <p><strong>Severity Level:</strong> ${severityLevel}</p>
            <p><strong>Severity Description:</strong> ${severityDescription}</p>
            <p><strong>Message:</strong> ${message}</p>
            </div>
            `)

            .addTo(mapInstance);} else {console.warn('Feature properties are missing: ', feature);
            
          } 
          } else { 
          console.warn('Clicked feature is not a point: ', feature);
          }
          });
        })
        .catch(error => console.error('Error fetching geojson data: ', error));
    });

    setMap(mapInstance);

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  return (
    <div className="flex">
  <div ref={mapContainerRef} className="w-[50%] h-[800px] rounded-lg overflow-hidden"></div>

  {map && (
    <div className="w-[50%] ml-4 bg-gray-800 p-4 rounded-lg shadow-lg self-start">
      <h2 className="text-white text-lg font-bold mb-3">Map Controls</h2>
      <MapUI map={map} />
    </div>
  )}
</div>

  );
};

export default Map;
