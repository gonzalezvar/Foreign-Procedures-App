// import React, { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
// import shadow from 'leaflet/dist/images/marker-shadow.png';

// // Corregir íconos por defecto de Leaflet
// L.Icon.Default.mergeOptions({
//     iconUrl: '/icons/marker.png',
//     // iconRetinaUrl: iconRetina,
//     shadowUrl: shadow,
// });

// const city_selection = document.getElementById("SelectCity");
// // Evento para cambiar el mapa según la ciudad seleccionada
// city_selection.addEventListener("change", function () {
//     const selectedCity = city_selection.value;
//     const mapFrame = document.querySelector("iframe");
//     if (selectedCity === "Madrid") {
//         mapFrame.src = '/offices_mapM.html';
//     } else if (selectedCity === "Barcelona") {
//         mapFrame.src = '/offices_mapB.html';
//     } else if (selectedCity === "Valencia") {
//         mapFrame.src = '/offices_mapV.html';
//     }
// });

// const MapViewer = ({ latitude, longitude, placeName = "Ubicación seleccionada" }) => {
//     const mapUrlM = '/offices_mapM.html';
//     const mapUrlB = '/offices_mapB.html';
//     const mapUrlV = '/offices_mapV.html';
//     return (

//         <div style={{ height: "400px", width: "100%" }}>
//             {/* <MapContainer center={[latitude, longitude]} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
//                 <TileLayer
//                     attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 />
//                 <Marker position={[latitude, longitude]}>
//                     <Popup>{placeName}</Popup>
//                 </Marker>
//             </MapContainer> */}
//             <form>
//                 <fieldset>
//                     <div className="d-flex">
//                         <label class="form-label">Select city:</label>
//                         <select id="SelectCity" class="form-select">
//                             <option>Madrid</option>
//                             <option>Barcelona</option>
//                             <option>Valencia</option>
//                         </select>
//                         <button type="submit" className="btn btn-info ms-2">Get offices</button>
//                     </div>
//                 </fieldset>
//             </form>
//             <iframe
//                 src={mapUrlM}
//                 width="100%"
//                 height="100%"
//                 style={{ border: 'none' }}
//                 title="Mapa de Ruta con Accesibilidad"
//             >
//                 Tu navegador no soporta iframes.
//             </iframe>
//         </div>
//     );
// };

// export default MapViewer;

import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import shadow from 'leaflet/dist/images/marker-shadow.png';

// Correct default Leaflet icons
L.Icon.Default.mergeOptions({
    iconUrl: '/icons/marker.png',
    shadowUrl: shadow,
});

const MapViewer = () => {
    const [selectedCity, setSelectedCity] = useState("Madrid");
    const [mapSrc, setMapSrc] = useState('/offices_mapM.html');

    useEffect(() => {
        let newMapSrc;
        if (selectedCity === "Madrid") {
            newMapSrc = '/offices_mapM.html';
        } else if (selectedCity === "Barcelona") {
            newMapSrc = '/offices_mapB.html';
        } else if (selectedCity === "Valencia") {
            newMapSrc = '/offices_mapV.html';
        }
        setMapSrc(newMapSrc);
    }, [selectedCity]); // Reloads when it changes

    const handleCityChange = (event) => {
        setSelectedCity(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent page reload
    };

    return (
        <div style={{ height: "600px", width: "100%" }}>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <div className="d-flex mb-3">
                        <label htmlFor="SelectCity" className="form-label me-2">Select city:</label>
                        <select id="SelectCity" className="form-select" value={selectedCity} onChange={handleCityChange}>
                            <option value="Madrid">Madrid</option>
                            <option value="Barcelona">Barcelona</option>
                            <option value="Valencia">Valencia</option>
                        </select>
                    </div>
                </fieldset>
            </form>
            <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                title={`Map of offices in ${selectedCity}`}
            >
                Your browser does not support iframes.
            </iframe>
        </div>
    );
};

export default MapViewer;