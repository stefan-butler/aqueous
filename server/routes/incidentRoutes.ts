import express from "express";
import { convertIncidents, getAllIncidents } from "../controllers/incidentController";

const router = express.Router();

router.get("/geojson", convertIncidents );
router.get("/", getAllIncidents );


export default router;