import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '8px',
};

// 1. Define Chandigarh as the fallback center
const fallbackCenter = {
  lat: 30.7333,
  lng: 76.7794
};

// Define the libraries array outside the component
const libraries = ['places'];

// Map search types to Google Maps search keywords
const searchKeywords = {
  recycling: 'waste management facility',
  dermatologist: 'dermatologist',
  dumping: 'recycling',
};

export default function RecycleMap({ searchType }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyBn-fXE814v_0oUWXdkg_JSAnQKuLsOVZU", 
    libraries: libraries,
  });

  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);
  
  // 2. Create state for the map's center, defaulting to the fallback
  const [center, setCenter] = useState(fallbackCenter);

  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  // 3. New effect to get the user's location
  useEffect(() => {
    // Check if geolocation is available in the browser
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success: Set the map center to the user's location
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Error/Denial: User denied, so we'll just use the fallback
          console.warn("User denied geolocation. Falling back to default.");
          // No need to setCenter, it's already the fallback
        }
      );
    } else {
      // Geolocation is not supported by this browser
      console.error("Geolocation is not supported by this browser.");
    }
  }, []); // Run this effect only once when the component mounts

  // 4. This effect now runs when the map, searchType, OR center changes
  useEffect(() => {
    if (isLoaded && map && window.google) {
      const keyword = searchKeywords[searchType] || 'recycling';
      const service = new window.google.maps.places.PlacesService(map);
      
      const request = {
        location: center, // 5. Use the new dynamic 'center' state
        radius: '10000', // 10km radius
        keyword: keyword,
      };

      setMarkers([]);
      setSelected(null);

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
          console.error(`Places service failed for keyword "${keyword}" with status:`, status);
        }
      });
    }
  }, [isLoaded, map, searchType, center]); // 6. Add 'center' to the dependency array

  if (loadError) return <div className="text-red-500">Error loading map. Please check your API key.</div>;
  if (!isLoaded) return <div className="text-brand-pink-dark">Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center} // 7. Use the dynamic 'center' state here
      zoom={13}
      onLoad={onMapLoad}
    >
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={{ lat: marker.lat, lng: marker.lng }}
          title={marker.name}
          onClick={() => setSelected(marker)}
        />
      ))}

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