import axios from "axios";
import GeoJSONFeature from "../models/geoJson";

export const fetchAndStoreGeoJSON = async () => {
  try {
    const response = await axios.get('https://environment.data.gov.uk/flood-monitoring/id/floodAreas?_limit=5000');
    const data = response.data.items;

    for (const item of data) {
      const feature = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [item.long, item.lat], // Ensure proper GeoJSON format
        },
        properties: {
          id: item["@id"],
          description: item.description,
          fwdCode: item.fwdCode,
        },
      };

      // Upsert the GeoJSON feature in MongoDB
      await GeoJSONFeature.findOneAndUpdate(
        { "properties.id": feature.properties.id }, // Match by the unique ID
        feature,
        { upsert: true, new: true }
      );
    }
    console.log("GeoJSON features successfully stored in MongoDB!");
  } catch (error) {
    console.error("Error fetching or storing GeoJSON features: ", error);
  }
};

