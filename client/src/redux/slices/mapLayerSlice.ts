// redux/slices/mapLayerSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LayerState {
  layerId: string;
  visibility: boolean;
}

interface MapLayersState {
  layers: LayerState[];
}

const initialState: MapLayersState = {
  layers: [
    { layerId: 'heatmap', visibility: true },
    { layerId: 'active-warnings', visibility: true },
    { layerId: 'incidents', visibility: true },
  ],
};

const mapLayerSlice = createSlice({
  name: 'mapLayers',
  initialState,
  reducers: {
    toggleLayer: (state, action: PayloadAction<string>) => {
      const layer = state.layers.find(layer => layer.layerId === action.payload);
      if (layer) {
        layer.visibility = !layer.visibility;
      }
    },
  },
});

export const { toggleLayer } = mapLayerSlice.actions;
export default mapLayerSlice.reducer;
