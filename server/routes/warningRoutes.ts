import express from "express";
import { getActiveWarnings } from '../controllers/warningController';

const router = express.Router();

router.get("/geojson/active-warnings", getActiveWarnings );

export default router;