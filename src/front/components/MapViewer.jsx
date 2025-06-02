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
    const [geolocationStatus, setGeolocationStatus] = useState('pending'); // new state for explicit status

    // Load map and office data when selectedCity changes
    useEffect(() => {
        console.log(`[useEffect 1] selectedCity changed to: ${selectedCity}`);

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
        setOfficesData([]); // Clear previous data immediately
        setNearestOffice(null); // Clear nearest office immediately
        setGeolocationStatus('pending'); // Reset geolocation status

        // Fetch the JSON data
        const fetchOffices = async () => {
            console.log(`[fetchOffices] Attempting to fetch: ${currentJsonPath}`);
            try {
                const response = await fetch(currentJsonPath);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log(`[fetchOffices] Successfully fetched data for ${selectedCity}:`, data);
                setOfficesData(data); // Set the fetched data to state
            } catch (error) {
                console.error("[fetchOffices] Error fetching office data:", error);
                setOfficesData([]); // Reset on error
            }
        };

        fetchOffices();

        // Get user location
        if (navigator.geolocation) {
            console.log('[Geolocation] navigator.geolocation is available.');
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    setUserLocation({ latitude: userLat, longitude: userLng });
                    setGeolocationStatus('granted'); // Update status
                    console.log(`[Geolocation] User location set: Lat=${userLat}, Lng=${userLng}`);
                },
                (error) => {
                    console.error("[Geolocation] Error getting user location:", error);
                    setGeolocationStatus('denied'); // Update status
                    if (error.code === error.PERMISSION_DENIED) {
                        console.error("User denied geolocation request. Please enable it in browser settings.");
                        alert("Geolocation access denied. Cannot find nearest office.");
                    } else if (error.code === error.POSITION_UNAVAILABLE) {
                        console.error("User position unavailable.");
                    } else if (error.code === error.TIMEOUT) {
                        console.error("Geolocation request timed out.");
                    }
                    setUserLocation(null); // Clear user location on error
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // Add options for better accuracy/timeout
            );

            // Optional: Check permission state immediately (Safari doesn't support query sometimes)
            if (navigator.permissions && navigator.permissions.query) {
                navigator.permissions.query({ name: 'geolocation' }).then(result => {
                    console.log('[Geolocation Permissions] Current permission state:', result.state);
                }).catch(err => console.error('[Geolocation Permissions] Error querying permission:', err));
            }

        } else {
            console.error("[Geolocation] Geolocation is not supported by this browser.");
            setGeolocationStatus('not_supported'); // Update status
            setUserLocation(null);
        }
    }, [selectedCity]);

    // Calculate nearest office when officesData or userLocation changes
    useEffect(() => {
        console.log(`[useEffect 2] officesData length: ${officesData.length}, userLocation:`, userLocation);

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
                        distance: distance.toFixed(2)
                    };
                }
            });
            setNearestOffice(closestOffice);
            console.log('[useEffect 2] Nearest office calculated:', closestOffice);
        } else {
            setNearestOffice(null);
            console.log('[useEffect 2] Cannot calculate nearest office (missing data or location).');
        }
    }, [officesData, userLocation]); // Dependencies: officesData and userLocation

    const handleCityChange = (event) => {
        setSelectedCity(event.target.value);
        // Reset ALL relevant states immediately
        setNearestOffice(null);
        setUserLocation(null);
        setOfficesData([]);
        setGeolocationStatus('pending'); // Reset status on city change
        console.log(`[handleCityChange] City changed to: ${event.target.value}. States reset.`);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    return (
        <div style={{ height: "400px", width: "100%" }}>
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
                ) : (
                    // Refined conditional rendering based on detailed statuses
                    geolocationStatus === 'pending' || officesData.length === 0 ? (
                        <p>Fetching your location and office data...</p>
                    ) : geolocationStatus === 'denied' ? (
                        <p style={{ color: 'red' }}>Geolocation access denied. Please enable it in your browser settings to find the nearest office.</p>
                    ) : geolocationStatus === 'not_supported' ? (
                        <p style={{ color: 'orange' }}>Geolocation is not supported by your browser.</p>
                    ) : ( // Fallback for when data is loaded and location is granted, but no office found (e.g., too far)
                        <p>No nearest office found in the selected city within a reasonable range.</p>
                    )
                )}
            </div>
        </div>
    );
};

export default MapViewer;