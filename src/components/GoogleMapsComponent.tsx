'use client'
import React from 'react';
import { GoogleMap, LoadScript, Marker, MarkerClusterer } from '@react-google-maps/api';

const containerStyle = {
  width: '600px',
  height: '600px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  margin: '20px auto'
};

const center = {
  lat: 37.437041393899676,
  lng: -4.191635586788259
};

const locations = [
  { lat: 37.437041393899676, lng: -4.191635586788259 },
  { lat: 37.440575591901045, lng: -4.231433159434073 },
  // Add more locations here
];

const iconColor = '#00FF00'; // Example color, you can change it

const MultipleMarkersMap = () => {
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''}>
      
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={6}
      >
        <MarkerClusterer>
          {(clusterer) => (
            <>
              {locations.map((location, index) => (
                <Marker 
                  key={index} 
                  position={location} 
                  title={"Hello"}
                  icon={{
                    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                    fillColor: iconColor,
                    fillOpacity: 1,
                    strokeWeight: 1,
                    scale: 2,
                  }}
                  clusterer={clusterer}
                />
              ))}
            </>
          )}
        </MarkerClusterer>
      </GoogleMap>
    </LoadScript>
  );
};

export default MultipleMarkersMap;

