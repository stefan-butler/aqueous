import fs from 'fs';
import { IFloodLocation } from '../models/floodLocation';  
import FloodLocation from '../models/floodLocation';

async function exportGeoJSON() {
  const locations = await FloodLocation.find();

  const geoJSON = {
    type: "FeatureCollection",
    features: locations.map((location: IFloodLocation) => ({
      type: "Feature",
      geometry: location.location,  // Assuming location.location is of type GeoJSON
      properties: {
        id: location.id,
        description: location.description,
        fwdCode: location.fwdCode,
      }
    }))
  };

  fs.writeFileSync('floodLocations.geojson', JSON.stringify(geoJSON, null, 2));
  console.log('GeoJSON file saved!');
};

exportGeoJSON();