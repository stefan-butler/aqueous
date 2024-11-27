import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import mapLayerReducer from './slices/mapLayerSlice';
import incidentReducer from './slices/incidentSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    mapLayers: mapLayerReducer,
    incident: incidentReducer
  },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;