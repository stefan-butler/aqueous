import axios from "axios";
import FloodWarning from "../models/floodWarning";

export const fetchAndStoreFloodData = async () => {
  try {
    const response = await axios.get('https://environment.data.gov.uk/flood-monitoring/id/floods');
    const data = response.data;
    for (const item of data) {
      const id = item["@id"];
      const severity = item.severity || 4;
      const message = item.message || "No message";
      const polygonUrl = item.floodArea.polygon;

      const polygonResponse = await axios.get(polygonUrl);
      const polygonData = polygonResponse.data;
      const coordinates = polygonData.features[0].geometry.coordinates;

      const floodWarning = new FloodWarning({
        polygon_id: id,
        severity: severity,
        message: message,
        polygon: coordinates
      });

      await floodWarning.save();
    }
    console.log('Flood data successfully fetched and stored!');
  } catch (error) {
    console.error('Error fetching or storing flood data:', error);
 }
}
