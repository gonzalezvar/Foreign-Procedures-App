import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';



import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';

// Corregir íconos por defecto de Leaflet
L.Icon.Default.mergeOptions({
    iconUrl: '/icons/marker.png',
    // iconRetinaUrl: iconRetina,
    shadowUrl: shadow,
});

const MapViewer = ({ latitude, longitude, placeName = "Ubicación seleccionada" }) => {
    return (
        <div style={{ height: "400px", width: "100%" }}>
            <MapContainer center={[latitude, longitude]} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[latitude, longitude]}>
                    <Popup>{placeName}</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default MapViewer;
