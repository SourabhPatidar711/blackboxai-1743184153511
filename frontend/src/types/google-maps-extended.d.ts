// Global type extensions for Google Maps
import 'google.maps';

declare module 'google.maps' {
  interface WeightedLocation {
    location: google.maps.LatLng | google.maps.LatLngLiteral;
    weight?: number;
  }

  interface HeatmapLayer {
    getData(): google.maps.MVCArray<google.maps.LatLng | WeightedLocation>;
    setData(data: google.maps.MVCArray<google.maps.LatLng | WeightedLocation> | google.maps.LatLng[] | WeightedLocation[]): void;
  }

  interface HeatmapLayerOptions {
    data: google.maps.MVCArray<google.maps.LatLng | WeightedLocation> | google.maps.LatLng[] | WeightedLocation[];
  }
}