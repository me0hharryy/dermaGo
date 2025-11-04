import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '8px',
};

// Start map centered on Chandigarh, as requested
const center = {
  lat: 30.7333,
  lng: 76.7794
};

// Define the libraries array outside the component
const libraries = ['places'];

export default function RecycleMap() {
  const { isLoaded, loadError } = useJsApiLoader({
    // IMPORTANT: Add your Google Maps API key here
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyBn-fXE814v_0oUWXdkg_JSAnQKuLsOVZU", 
    libraries: libraries, // <-- This is the corrected line
  });

  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);

  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  // This effect runs when the map loads
  useEffect(() => {
    // Ensure the map is loaded AND the window.google object is available
    if (isLoaded && map && window.google) { 
      const service = new window.google.maps.places.PlacesService(map);
      
      const request = {
        location: center,
        radius: '10000', // 10km radius
        keyword: 'cosmetic recycling' // Search term
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          const newMarkers = results.map(place => ({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            name: place.name,
            address: place.vicinity,
          }));
          setMarkers(newMarkers);
        } else {
          console.error("Places service failed with status:", status);
        }
      });
    }
  }, [isLoaded, map]); // Dependencies for the effect

  if (loadError) return <div className="text-red-500">Error loading map. Please check your API key.</div>;
  if (!isLoaded) return <div className="text-brand-pink-dark">Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
      onLoad={onMapLoad}
    >
      {/* Add markers for each location found */}
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={{ lat: marker.lat, lng: marker.lng }}
          title={marker.name}
          onClick={() => setSelected(marker)}
        />
      ))}

      {/* Show an info window when a marker is clicked */}
      {selected ? (
        <InfoWindow
          position={{ lat: selected.lat, lng: selected.lng }}
          onCloseClick={() => setSelected(null)}
        >
          <div>
            <h4 className="font-bold text-brand-text">{selected.name}</h4>
            <p className="text-brand-text-light">{selected.address}</p>
          </div>
        </InfoWindow>
      ) : null}
    </GoogleMap>
  );
}