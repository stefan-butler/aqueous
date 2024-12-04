import { useEffect, useRef, useState } from 'react';
import { RootState } from '../redux/store';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapUI  from './mapUI'
import { useSelector } from 'react-redux';
mapboxgl.accessToken = 'pk.eyJ1IjoibWpzc2NvdHQiLCJhIjoiY200MmpxOHprMDFsNzJrc2JvY2J4MnoyaCJ9.Lh126FuRrcsE0jo3JGfO8A'; // replace with env file 

const Map = () => {
  const layers = useSelector((state: RootState) => state.mapLayers.layers)

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
      center: [-2, 53.0], // Longitude, Latitude for the UK
      zoom: 5.7,
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
            layout: { 
              visibility: layers.find((layer) => layer.layerId === 'heatmap')?.visibility
              ? 'visible'
              : 'none',              
            },
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
            layout: { 
              visibility: layers.find((layer) => layer.layerId === 'active-warnings')?.visibility
              ? 'visible'
              : 'none',              
            },
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

        fetch('http://localhost:3000/api/incidents/geojson')
        .then((response) => response.json())
        .then((data) => {
          mapInstance.addSource('incidents', {
            type: 'geojson',
            data: data,
            generateId: true,
          });

          mapInstance.addLayer({
            id: 'incidents',
            type: 'symbol',
            source: 'incidents',
            layout: {
              'icon-image': 'mapbox-cross',
              'icon-size': 1.2,
              visibility: layers.find((layer) => layer.layerId === 'incidents')?.visibility
              ? 'visible'
              : 'none', 
            },
            paint: {
              'icon-color': '#0074D9',
            },
          });

          mapInstance.on('click', 'incidents', (e) => {
            if (!e.features || e.features.length === 0) return;
            const feature = e.features[0];

            if (feature.geometry.type === 'Point') {
              const coordinates = feature.geometry.coordinates as [number, number];
              const { title, severity, injuries,urgency, additionalComments, user_id } = feature.properties || {};

              new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(`
                  <div>
                    <h3><strong>Incident</strong></h3>
                    <h3><strong>Title: </strong>${title || 'Incident'}</h3>
                    <p><strong>Severity: </strong>${severity || ''}<p>
                    <p><strong>Injuries: </strong>${injuries || ''}<p>
                    <p><strong>Urgency: </strong>${urgency || ''}<p>
                    <p><strong>Additional Comments: </strong>${additionalComments || ''}<p>
                    <p><strong>User ID: </strong>${user_id || ''}<p>
                  </div>
                `)
                .addTo(mapInstance);
            } else {
              console.warn('Clicked feature is not a point: ', feature);
            }
          });
        })
        .catch((error) => {
          console.error('Error fetching geojson incidents: ', error);
        });
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
    {/* Left Section: Map */}
    <div className="w-[50%] h-[800px] rounded-lg overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full"></div>
    </div>

    {/* Right Section: Map Controls and Description */}
    <div className="w-[50%] ml-4 ">
      {/* Description Above MapUI */}
      <div className="bg-gray-800 p-4 rounded-lg mb-4 shadow-lg text-center">
        <h2 className="text-xl font-bold text-white mb-4">Welcome to Aqueous</h2>
        <p className="text-white mb-4">
          Our interactive map provides live flood warnings from the UK government's official flood warning API, giving you up-to-date information on affected areas. With a heatmap that visualizes flood impact and the ability to view user-reported incidents.
        </p>
        <p className="text-white mb-4">
          Log in to report incidents in your area, or register as a responder to interact with incidents and assist those in need.
        </p>
        <h3 className="text-white text-lg font-semibold">Stay informed, stay prepared, and help protect those at risk.</h3>
      </div>



      {/* Map Controls */}
      {map && (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-white text-lg font-bold mb-3 mt-4 text-center">Map Key</h2>
        <h3 className="text-white font-bold mb-4">Flood Severity Levels</h3>
        <div className="flex justify-center space-x-4">
          {/* Severity Level 1 */}
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
            <p className="text-white">Severe Flooding (Danger to Life)</p>
          </div>
          {/* Severity Level 2 */}
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
            <p className="text-white">Flooding is Expected (Immediate Action Required)</p>
          </div>
          {/* Severity Level 3 */}
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
            <p className="text-white">Flooding is Possible (Be Prepared)</p>
          </div>
        </div>
      
        <h3 className="text-white font-bold mt-8 mb-4">User Incident Reports</h3>
        <div className="flex space-x-4 mb-4">
          {/* User Incident Marker */}
          <div className="flex items-center">
            <div className="w-6 h-6 bg-transparent rounded-full flex justify-center items-center mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#39A6D6"
                viewBox="0 0 16 16"
              >
                <circle cx="8" cy="8" r="6" />
              </svg>
            </div>
            <p className="text-white">User Reported Incident</p>
          </div>
        </div>
          <h2 className="text-white text-lg font-bold mb-3 mt-4 text-center">Map Controls</h2>
          <MapUI map={map} />
        </div>
      )}
    </div>
  </div>
  );
};

export default Map;
