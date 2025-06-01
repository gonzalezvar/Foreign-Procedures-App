import { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import shadow from 'leaflet/dist/images/marker-shadow.png';


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
    }, [selectedCity]); 

    const handleCityChange = (event) => {
        setSelectedCity(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault(); 
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