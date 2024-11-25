import { connectDB } from "../database";
import { fetchAndStoreGeoJSON } from "./fetchGeoJson";

const run = async () => {
  try {
    await connectDB();
    console.log("Database connected");
    await fetchAndStoreGeoJSON(); 
    console.log("Flood locations successfully fetched and stored!");
  } catch (error) {
    console.error("Error running location service: ", error);
  } finally {
    process.exit();
  }
};

run();