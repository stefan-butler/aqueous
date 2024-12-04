import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { toggleLayer } from '../redux/slices/mapLayerSlice';

interface MapUIProps {
  map: mapboxgl.Map;
}

const MapUI: React.FC<MapUIProps> = ({ map }) => {
  const layers = useSelector((state: RootState) => state.mapLayers.layers);
  const dispatch = useDispatch();

  const handleToggleLayer = (layerId: string) => {
    dispatch(toggleLayer(layerId)); 
  };

  React.useEffect(() => {
    if (map && layers) {
      layers.forEach((layer) => {
        if (map.getLayer(layer.layerId)) {
          map.setLayoutProperty(
            layer.layerId,
            'visibility',
            layer.visibility ? 'visible' : 'none'
          );
        }
      });
    }
  }, [layers, map]);

  return (
    <div className="mt-4 bg-gray-800 p-4 rounded-lg shadow-lg">
      {/* Title */}
      <h2 className="text-white text-lg font-bold mb-3">Toggle Map Layers</h2>
      
      {/* Layer Toggles */}
      <div className="space-y-3">
        {layers.map((layer) => (
          <div 
            key={layer.layerId} 
            className="flex items-center justify-between bg-gray-700 p-3 rounded-lg"
          >
            <span className="text-white text-sm font-medium">
              {layer.layerId}
            </span>
            <button
              onClick={() => handleToggleLayer(layer.layerId)}
              className={`py-1 px-4 rounded font-medium text-sm ${
                layer.visibility
                  ? 'bg-gray-800 hover:bg-red-600 text-white'
                  : 'bg-white hover:bg-green-600 text-gray-800'
              }`}
            >
              {layer.visibility ? 'Hide' : 'Show'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapUI;
