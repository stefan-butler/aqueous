
export interface Incident {
  title: string;
  incidentDate: string;
  location: {
    longitude: undefined | number,
    latitude: undefined | number,
  }; 
  severity: string;
  floodType: string;
  injuries: string; 
  urgency: string;
  name: string;
  phone: string;
  email:string;
  additionalComments: string;
  user_id: string;
  _id?: string;
}

export interface IncidentState {
  global: {
    list: Incident [];
    loading: boolean;
    error: string | null;
  };
  user: {
    list: Incident [];
    loading: boolean;
    error: string | null;
  };
  
}