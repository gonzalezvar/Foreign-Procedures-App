import { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import shadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
    iconUrl: '/icons/marker.png',
    shadowUrl: shadow,
});

// Calculate distance between two geopoints
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth (Km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
};

const MapViewer = () => {
    const [selectedCity, setSelectedCity] = useState("Madrid");
    const [mapSrc, setMapSrc] = useState('/offices_mapM.html');
    const [userLocation, setUserLocation] = useState(null); // {latitude, longitude}
    const [nearestOffice, setNearestOffice] = useState(null); // {name, address, distance}
    const [officesData, setOfficesData] = useState([]);

    // Load map and office data when selectedCity changes
    useEffect(() => {
        let newMapSrc;
        let currentJsonPath;

        if (selectedCity === "Madrid") {
            newMapSrc = '/offices_mapM.html';
            currentJsonPath = '/offices_madrid.json';
        } else if (selectedCity === "Barcelona") {
            newMapSrc = '/offices_mapB.html';
            currentJsonPath = '/offices_barcelona.json';
        } else if (selectedCity === "Valencia") {
            newMapSrc = '/offices_mapV.html';
            currentJsonPath = '/offices_valencia.json';
        }
        setMapSrc(newMapSrc);
        setOfficesData([]); // Clear previous data

        // Fetch the JSON data
        const fetchOffices = async () => {
            try {
                const response = await fetch(currentJsonPath);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setOfficesData(data); // Set the fetched data to state
            } catch (error) {
                console.error("Error fetching office data:", error);
                setOfficesData([]); // Reset on error
            }
        };

        fetchOffices();

        // Get user location and find nearest office
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    setUserLocation({ latitude: userLat, longitude: userLng });
                },
                (error) => {
                    console.error("Error getting user location:", error);
                    if (error.code === error.PERMISSION_DENIED) {
                        console.error("User denied geolocation request.");
                        alert("Geolocation access denied. Cannot find nearest office.");
                    }
                    setUserLocation(null); // Clear user location on error
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
            setUserLocation(null);
        }
    }, [selectedCity]);

    // Calculate nearest office when officesData or userLocation changes
    useEffect(() => {
        if (userLocation && officesData.length > 0) {
            let closestOffice = null;
            let minDistance = Infinity;

            officesData.forEach(office => {
                const distance = calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    office.latitude,
                    office.longitude
                );

                if (distance < minDistance) {
                    minDistance = distance;
                    closestOffice = {
                        name: office.name,
                        address: office.address,
                        distance: distance.toFixed(2) // Round to 2 decimal places
                    };
                }
            });
            setNearestOffice(closestOffice);
        } else {
            setNearestOffice(null);
        }
    }, [officesData, userLocation]);

    const handleCityChange = (event) => {
        setSelectedCity(event.target.value);
        setNearestOffice(null); // Reset
        setUserLocation(null); // Reset user location to re-trigger geolocation
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent reloading the page
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
            <div>
                <h6 className="mt-3">Nearest office from you:</h6>
                {nearestOffice ? (
                    <div>
                        <p><strong>Name:</strong> {nearestOffice.name}</p>
                        <p><strong>Address:</strong> {nearestOffice.address}</p>
                        <p><strong>Distance:</strong> {nearestOffice.distance} km</p>
                    </div>
                ) : userLocation === null ? (
                    <p>Fetching your location...</p>
                ) : officesData.length === 0 ? (
                    <p>Loading office data...</p>
                ) : (
                    <p>No nearest office found or geolocation denied.</p>
                )}
            </div>
        </div>
    );
};

export default MapViewer;