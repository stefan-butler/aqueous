import axios from "axios";
import FloodWarning from "../models/floodWarning";

export const fetchAndStoreFloodData = async () => {
  try {
    const response = await axios.get('http://environment.data.gov.uk/flood-monitoring/id/floods?min-severity=3');
    const data = response.data.items;
    for (const item of data) {
      const id = item["@id"];
      const severity = item.severity || 4;
      const message = item.message || "No message";
      const floodArea = item.floodAreaId

      const floodWarning = new FloodWarning({
        polygon_id: id,
        severity: severity,
        message: message,
        floodArea: floodArea,
      });

      await floodWarning.save();
    }
    console.log('Flood data successfully fetched and stored!');
  } catch (error) {
    console.error('Error fetching or storing flood data:', error);
 }
}
