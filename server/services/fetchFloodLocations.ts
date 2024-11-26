import axios from "axios";
import FloodLocation from "../models/floodLocation";

export const fetchAndStoreFloodLocation = async () => {
  try {
    const response = await axios.get('https://environment.data.gov.uk/flood-monitoring/id/floodAreas?_limit=5000');
    const data = response.data.items;

    for (const item of data) {
      const title = item.fwdCode;
      const latitude = item.lat;
      const longitude = item.long;

      await FloodLocation.findOneAndUpdate(
        { title },
        { title, latitude, longitude},
        { upsert: true, new: true }
      );
    }
    console.log("Flood locations successfully fetched and stored!");
  } catch (error) {
    console.error("Error fetching or storing locations: ", error);
  }
};