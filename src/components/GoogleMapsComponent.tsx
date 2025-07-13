'use client'
import React from 'react';
import { GoogleMap, LoadScript, Marker, MarkerClusterer } from '@react-google-maps/api';
import { monthNameToColorClass } from '@/lib/utils';

const containerStyle = {
  width: '100%',
  height: '600px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  margin: '20px auto'
};

const center = {
  lat: 52.066939870994034,
  lng: 19.486062964770905
};

const locations = [
  { lat: 51.21371426217124, lng: 18.57941644883682 },
  { lat: 53.014561350489885, lng: 18.604353929728845 },
  // Add more locations here
];

const iconColor = '#00FF00'; // Example color, you can change it

export interface MultipleMarkersMapProps {
  events: Array<{
    id: string;
    name: string;
    start_date: string;
    lat: number;
    lng: number;
  }>;
}

const MultipleMarkersMap = ({events}: MultipleMarkersMapProps) => {
  
  if (!events || events.length === 0) {
    return <div className="text-center text-gray-500">No events available</div>;
  }

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
              {events.map((event, index) => (
                <Marker 
                  key={index} 
                  position={{ lat: event.lat, lng: event.lng }} 
                  title={`${event.name} ${"  "} ${new Date(event.start_date).getDate()} ${new Date(event.start_date).toLocaleString('default', { month: 'long' })} ${new Date(event.start_date).getFullYear()}`}
                  icon={{
                    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                    fillColor: monthNameToColorClass(new Date(event.start_date).toLocaleString('default', { month: 'long' })).hex500,
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

