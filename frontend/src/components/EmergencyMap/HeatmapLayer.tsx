import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, LoadScript, HeatmapLayer } from '@react-google-maps/api';
import { Disaster } from '../../types/disaster';
import { useApi } from '../../services/api';

const mapContainerStyle = {
  width: '100%',
  height: '600px'
};

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629
};

interface HeatmapLayerProps {
  disasters: Disaster[];
  onMapClick?: (e: google.maps.MapMouseEvent) => void;
  center?: google.maps.LatLngLiteral;
  zoom?: number;
}

const HeatmapLayerComponent: React.FC<HeatmapLayerProps> = ({ 
  disasters, 
  onMapClick, 
  center = defaultCenter, 
  zoom = 5 
}) => {
  const [heatmapData, setHeatmapData] = useState<
    Array<{ location: google.maps.LatLng; weight: number }>
  >([]);

  const processDisasterData = useCallback((disasters: Disaster[]) => {
    return disasters.map(d => ({
      location: new google.maps.LatLng(d.location.lat, d.location.lng),
      weight: d.severity * 0.1
    }));
  }, []);

  useEffect(() => {
    if (disasters.length > 0) {
      const processedData = processDisasterData(disasters);
      setHeatmapData(processedData);
    }
  }, [disasters, processDisasterData]);

  return (
    <div className="map-container" style={{ height: '100%', width: '100%' }}>
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GMAPS_API_KEY || ''}
        libraries={['visualization']}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoom}
          onClick={onMapClick}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true
          }}
        >
          <HeatmapLayer 
            data={heatmapData}
            options={{
              radius: 20,
              opacity: 0.6,
              gradient: [
                'rgba(0, 255, 255, 0)',
                'rgba(0, 255, 255, 1)',
                'rgba(0, 191, 255, 1)',
                'rgba(0, 127, 255, 1)',
                'rgba(0, 63, 255, 1)',
                'rgba(0, 0, 255, 1)',
                'rgba(0, 0, 223, 1)',
                'rgba(0, 0, 191, 1)',
                'rgba(0, 0, 159, 1)',
                'rgba(0, 0, 127, 1)',
                'rgba(63, 0, 91, 1)',
                'rgba(127, 0, 63, 1)',
                'rgba(191, 0, 31, 1)',
                'rgba(255, 0, 0, 1)'
              ]
            }}
          />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default HeatmapLayerComponent;