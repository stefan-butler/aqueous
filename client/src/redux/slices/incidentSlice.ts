import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Incident, IncidentState } from '../../types/incident-types';
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const initialState: IncidentState = {
  global: {
    list: [],
    loading: false,
    error: null,
  },
  user: {
    list: [],
    loading: false,
    error: null,
  }
}

export const fetchGlobalIncidents = createAsyncThunk ('incidents/fetchGlobalIncidents', 
  async(_, thunkAPI) => {
  try{
    const response = await axios.get('http://localhost:3000/api/incidents');
    return response.data.incidents
  } catch (error) {
    console.error(error);
    return thunkAPI.rejectWithValue('Failed to fetch incidents');
  }
})

export const createIncident = createAsyncThunk ('incidents/createIncident',
  async ( newIncident: Incident, thunkApi) => {
    try {
      const token = localStorage.getItem('token');
   

      if (!token) {
        return thunkApi.rejectWithValue('No token provided');
      }

      const response = await axios.post('http://localhost:3000/create/incident', newIncident,
        {
          headers: {
            'Authorization': `Bearer ${token}`,  
            'Content-Type': 'application/json',  
          }
        }
      )
      return response.data.newIncident
    } catch (error) {
      console.error(error);
      return thunkApi.rejectWithValue('Failed to create incident')
    }
  }
)

export const fetchReporterIncidents = createAsyncThunk ('incidents/fetchReporterIncidents',
  async (reporterid: string | undefined, thunkApi) => {
    try {
      const token = localStorage.getItem('token');
   

      if (!token) {
        return thunkApi.rejectWithValue('No token provided');
      }

      const response = await axios.get(`http://localhost:3000/reporter/${reporterid}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,  
            'Content-Type': 'application/json',  
          }
        }
      )
      return response.data
    } catch (error) {
      console.error(error);
      return thunkApi.rejectWithValue('Failed to create incident')
    }
  }
)

const incidentSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGlobalIncidents.pending, (state) => {
        state.global.loading = true;
        state.global.error = null;
      })
      .addCase(fetchGlobalIncidents.fulfilled, (state, action: PayloadAction<Incident[]>) => {
        state.global.loading = false;
        state.global.list = action.payload;
      })
      .addCase(fetchGlobalIncidents.rejected, (state, action) => {
        state.global.loading = false;
        state.global.error = action.payload as string
      })
      .addCase(fetchReporterIncidents.pending, (state) => {
        state.user.loading = true;
        state.user.error = null;
      })
      .addCase(fetchReporterIncidents.fulfilled, (state, action: PayloadAction<Incident[]>) => {
        state.user.loading = false;
        state.user.list = action.payload;
      })
      .addCase(fetchReporterIncidents.rejected, (state, action) => {
        state.user.loading = false;
        state.user.error = action.payload as string
      })
      .addCase(createIncident.pending, (state) => {
        state.global.loading = true;
        state.global.error = null;
      })
      .addCase(createIncident.fulfilled, (state, action: PayloadAction<Incident>) => {
        state.global.loading = false;
        state.global.list.push(action.payload); 
      })
      .addCase(createIncident.rejected, (state, action) => {
        state.global.loading = false;
        state.global.error = action.payload as string;
      });
  }
});


export default incidentSlice.reducer