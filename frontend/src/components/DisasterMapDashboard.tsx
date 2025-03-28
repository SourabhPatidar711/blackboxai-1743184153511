import React, { useState, useEffect, useRef } from 'react';
import HeatmapLayer from './EmergencyMap/HeatmapLayer';
import { useApi } from '../services/api';
import { Disaster } from '../types/disaster';

const DisasterMapDashboard: React.FC = () => {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = useApi();
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const fetchDisasters = async () => {
      try {
        const response = await api.get('/disasters');
        setDisasters(response.data);
      } catch (err) {
        setError('Failed to load disaster data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const setupWebSocket = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const isDev = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1';
      const host = isDev
        ? `${window.location.hostname}:5000`
        : window.location.host;
      
      ws.current = new WebSocket(`${protocol}//${host}`);

      ws.current.onopen = () => console.log('WebSocket connected');
      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Realtime connection failed - updates may be delayed');
      };
      ws.current.onmessage = (event) => {
        try {
          const { action, data } = JSON.parse(event.data);
          if (action === 'UPDATE') {
            setDisasters(data);
          }
        } catch (err) {
          console.error('Error processing WebSocket message:', err);
        }
      };
      ws.current.onclose = () => {
        console.log('WebSocket disconnected - attempting to reconnect');
        setTimeout(setupWebSocket, 5000);
      };
    };

    fetchDisasters();
    setupWebSocket();

    // Fallback polling if WebSocket fails
    const pollInterval = setInterval(fetchDisasters, 60000);
    
    return () => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
      clearInterval(pollInterval);
    };
  }, [api]);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    console.log('Map clicked at:', e.latLng?.toJSON());
  };

  if (loading) return <div className="loading">Loading disaster data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-container">
      <h1>Disaster Response Dashboard</h1>
      <div className="map-view">
        <HeatmapLayer 
          disasters={disasters} 
          onMapClick={handleMapClick}
        />
      </div>
    </div>
  );
};

export default DisasterMapDashboard;