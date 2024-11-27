import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import mapLayerReducer from './slices/mapLayerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    mapLayers: mapLayerReducer,
  },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;