import { connectDB } from "../database";
import { fetchAndStoreFloodLocation } from "./fetchFloodLocations";

const run = async () => {
  try {
    await connectDB();
    console.log("Database connected");
    await fetchAndStoreFloodLocation(); 
    console.log("Flood locations successfully fetched and stored!");
  } catch (error) {
    console.error("Error running location service: ", error);
  } finally {
    process.exit();
  }
};

run();