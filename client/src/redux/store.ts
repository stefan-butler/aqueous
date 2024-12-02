import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import mapLayerReducer from './slices/mapLayerSlice';
import incidentReducer from './slices/incidentSlice';
import chatReducer from './slices/chatSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    mapLayers: mapLayerReducer,
    incident: incidentReducer,
    chat: chatReducer
  },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;