import axios from "axios";
import FloodLocation from "../models/floodLocation";

export const fetchAndStoreFloodLocation = async () => {
  try {
    const response = await axios.get('https://environment.data.gov.uk/flood-monitoring/id/floodAreas?_limit=5000');
    const data = response.data.items;

    for (const item of data) {
      const id = item["@id"];
      const description = item.description;
      const fwdCode = item.fwdCode;
      const lat = item.lat;
      const long = item.long;

      await FloodLocation.findOneAndUpdate(
        { id },
        { id, description, fwdCode, lat, long },
        { upsert: true, new: true }
      );
    }
    console.log("Flood locations successfully fetched and stored!");
  } catch (error) {
    console.error("Error fetching or storing locations: ", error);
  }
};