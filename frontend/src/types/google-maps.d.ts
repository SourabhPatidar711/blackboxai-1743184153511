declare namespace google.maps {
  interface LatLng {
    lat(): number;
    lng(): number;
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  interface MapMouseEvent {
    latLng: LatLng;
  }

  interface WeightedLocation {
    location: LatLng|LatLngLiteral;
    weight?: number;
  }

  interface HeatmapLayer {
    setData(data: WeightedLocation[]): void;
    setOptions(options: HeatmapLayerOptions): void;
  }

  interface HeatmapLayerOptions {
    data: WeightedLocation[];
    radius?: number;
    opacity?: number;
    gradient?: string[];
  }
}
