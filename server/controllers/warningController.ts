import { Request, Response } from "express";
import FloodLocation from "../models/floodLocation";
import FloodWarning from "../models/floodWarning";

export const getActiveWarnings = async function (req: Request, res: Response) {
  try {
    const warnings = await FloodWarning.find();
    const activeIds = warnings.map((warning) => warning.floodAreaId);
    const locations = await FloodLocation.find({ title: { $in: activeIds }})

    const geojson = {
      type: "FeatureCollection",
      features: locations.map((location) => {
        const warning = warnings.find((w) => w.floodAreaId === location.title);
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [location.longitude, location.latitude],
          },
          properties: {
            title: location.title,
            severityLevel: warning?.severityLevel,
            message: warning?.message,
          },
        };
      }),
    };
    res.json(geojson)
  } catch (error) {
    console.error("Error fetching active warnings: ", error);
    res.status(500).send("Internal server error");
  }
};