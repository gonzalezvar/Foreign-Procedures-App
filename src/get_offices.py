import requests
from googlemaps.convert import decode_polyline

# Import API KEY
with open('API_KEY.txt', 'r') as file:
    API_KEY = file.readline().strip()

# Directions API
DIRECTIONS_API = "https://places.googleapis.com/v1/places:searchText"

headers = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": API_KEY,
    "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.postalAddress,places.location"
}

payload = {
    "textQuery": "Oficina de extranjería",
    "locationBias": {
        "circle": {
            "center": {"latitude": 40.4165, "longitude": -3.70256},
            "radius": 2000
        }
    },
    "regionCode": "es"  # Only in Spain
}


def get_offices():
    response = requests.post(DIRECTIONS_API, json=payload, headers=headers)
    return (response)
