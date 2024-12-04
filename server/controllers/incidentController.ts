import {Request, Response, NextFunction} from 'express'
import Incident from "../models/incident";

export interface ExtendedRequest extends Request {
  user?: { _id: string };
}


const createIncident = async (req: ExtendedRequest, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      res.status(401).json({ message: 'Unauthorized: User ID is required' });
      return;
    }

    const incident = req.body
    const userid = req.user._id
 
    const newIncident = await Incident.create({
      title: incident.title,
      incidentDate: incident.incidentDate,
      location: {
        longitude: incident.location.longitude,
        latitude: incident.location.latitude
      }, 
      severity: incident.severity,
      floodType: incident.floodType,
      injuries: incident.injuries, 
      urgency: incident.urgency,
      name: incident.name,
      phone: incident.phone,
      email: incident.email,
      additionalComments: incident.additionalComments,
      user_id: userid
    })

    res.status(201).json({message: 'New incident posted', newIncident})
  } catch (error) {
    console.error('Error creating an incident:', error);
    res.status(500).json({message: `Internal server issue: ${error}`})
  }
}

const getAllIncidents = async (req: Request, res: Response) => {
  try {
    const incidents = await Incident.find();
    res.status(200).json({message: 'Incidents fetched successfully', incidents})
  } catch (error) {
    console.error('Errors fetching incidents', error)
    res.status(500).json({message:`Internal server issue: ${error}`})
  }
}

const convertIncidents = async (req: Request, res: Response) => {
  try {
    const incidents = await Incident.find();
    const geoJSON = {
      type: 'FeatureCollection',
      features: incidents.map((incident: any) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [incident.location.longitude, incident.location.latitude],
        },
        properties: {
          title: incident.title,
          severity: incident.severity,
          injuries: incident.injuries,
          urgency: incident.urgency,
          additionalComments: incident.additionalComments,
          user_id: incident.user_id
        },
      })),
    };
    res.status(200).json(geoJSON);
  } catch (error) {
    console.error('Error converting incidents to geoJSON', error);
    res.status(500).json({message:`Internal server issue: ${error}`})
  }
}

const getIncidentsCreatedByUser = async (req: ExtendedRequest, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      res.status(401).json({ message: 'Unauthorized: User ID is required' });
      return;
    }

    const userid = req.user._id

    const userIdIncidents = await Incident.find({user_id: userid});
    res.status(200).json(userIdIncidents)
  } catch (error) {
    console.error('Errors fetching user incidents', error)
    res.status(500).json({message:`Internal server issue: ${error}`})
  }
}



export {createIncident, getAllIncidents, convertIncidents, getIncidentsCreatedByUser}