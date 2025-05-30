import requests
import folium
import os

# Import API KEY
try:
    with open('API_KEY.txt', 'r') as file:
        API_KEY = file.readline().strip()
        if not API_KEY:
            print("Warning: API_KEY.txt found but is empty.")
except FileNotFoundError:
    API_KEY = None
    print(f"Error: 'API_KEY.txt' not found in the current directory.")
except Exception as e:
    API_KEY = None
    print(f"Error reading API key: {e}")

# Directions API
PLACES_API = "https://places.googleapis.com/v1/places:searchText"

headers = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": API_KEY,
    "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location"
}

payload = {
    "textQuery": "Oficina de extranjería",
    "locationBias": {
        "circle": {
            "center": {"latitude": 40.4165, "longitude": -3.70256},
            "radius": 10000
        }
    },
    "regionCode": "es"  # Only in Spain
}


def get_offices():
    if not API_KEY:
        print("API_KEY is not set. Cannot proceed with API call.")
        return {"error": "API_KEY not provided"}, 400
    try:
        response = requests.post(PLACES_API, json=payload, headers=headers)
        response.raise_for_status()
        return response.json(), 200
    except requests.exceptions.HTTPError as e:
        print(
            f"HTTP Error from Google Places API: {e.response.status_code} - {e.response.text}")
        return {"error": f"Error de conexión con Google Places: {e.response.text}"}, e.response.status_code
    except requests.exceptions.ConnectionError as e:
        print(f"Connection Error: {e}")
        return {"error": f"Error de red: {e}"}, 500
    except requests.exceptions.RequestException as e:
        print(f"General Request Error at Google Places API: {e}")
        return {"error": f"Error de conexión con Google Places: {e}"}, 500
    except Exception as e:
        print(f"Unexpected error when processing Google Places response: {e}")
        return {"error": f"Error interno del servidor: {e}"}, 500


def create_offices_map(offices_data):
    map_center = [40.4165, -3.70256]
    m = folium.Map(location=[map_center[0], map_center[1]], zoom_start=13)

    if "places" in offices_data and offices_data["places"]:
        print(f"Found {len(offices_data['places'])} places")
        for place in offices_data["places"]:
            if "location" in place and "latitude" in place["location"] and "longitude" in place["location"]:
                latitude = place["location"]["latitude"]
                longitude = place["location"]["longitude"]
                address = place.get("formattedAddress",
                                    "Dirección no disponible")
                display_name = place.get("displayName", {}).get(
                    "text", "Oficina de extranjería")
                folium.Marker(
                    location=[latitude, longitude],
                    popup=f"<b>{display_name}</b><br>{address}",
                    icon=folium.Icon(color="blue", icon="info-sign")
                ).add_to(m)
            else:
                print(f"Place without location data: {place}")
    else:
        print("No places found in the API response or 'places' list is empty.")
        if "error" in offices_data:
            print(f"API Error: {offices_data['error']}")
    return m


if __name__ == "__main__":
    offices_response, status_code = get_offices()

    if status_code == 200 and "places" in offices_response:
        offices_map = create_offices_map(offices_response)
        map_file_path = "offices_map.html"
        offices_map.save(map_file_path)
    elif "error" in offices_response:
        print(f"Error: {offices_response['error']}")
    else:
        print("Failed to retrieve office data or no offices found.")
