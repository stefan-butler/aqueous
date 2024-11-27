
export interface Incident {
  title: string;
  incidentDate: string;
  location: {
    longitude: number | undefined,
    latitude: number | undefined,
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