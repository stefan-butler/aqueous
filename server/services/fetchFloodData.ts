import axios from "axios";
import FloodWarning from "../models/floodWarning";

export const fetchAndStoreFloodData = async () => {
  try {
    const response = await axios.get('http://environment.data.gov.uk/flood-monitoring/id/floods?min-severity=3');
    const data = response.data.items;
    for (const item of data) {
      const id = item["@id"];
      const severityLevel = item.severityLevel || 4;
      const message = item.message || "No message";
      const floodAreaId = item.floodAreaID

      await FloodWarning.findOneAndUpdate(
        { id: id},
        {
          severityLevel: severityLevel,
          message: message,
          floodAreaId,
        },
        { upsert: true, new: true}
      );
    }
    console.log('Flood data successfully fetched and stored!');
  } catch (error) {
    console.error('Error fetching or storing flood data:', error);
 }
}
