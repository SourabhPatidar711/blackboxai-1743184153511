export interface Disaster {
  id: string;
  type: 'flood' | 'earthquake' | 'fire' | 'other';
  location: {
    lat: number;
    lng: number;
  };
  severity: number;
  timestamp: string;
  description?: string;
  resources?: {
    medical_kits: number;
    food_packs: number;
    rescue_teams: number;
  };
}