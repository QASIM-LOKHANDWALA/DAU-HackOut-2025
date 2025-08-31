import pandas as pd
import joblib
from math import radians, sin, cos, sqrt, atan2

# Load the model, scaler, and data
model = joblib.load("city_score_model.pkl")
scaler = joblib.load("scaler.pkl")
df = pd.read_csv("city_data.csv")

# Haversine distance function
def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    a = min(1.0, max(0.0, a))  # clamp to [0,1]
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c

# Function to recommend top 5 cities
def recommend_cities(user_lat, user_lon, top_n=5):
    temp_df = df.copy()
    temp_df["user_distance"] = temp_df.apply(
        lambda row: haversine(user_lat, user_lon, row["Latitude"], row["Longitude"]),
        axis=1
    )
    
    closest_cities = temp_df.nsmallest(top_n, "user_distance")
    X_closest_scaled = scaler.transform(closest_cities[["Population","Cost of Living","Latitude","Longitude"]])
    closest_cities["pred_score"] = model.predict(X_closest_scaled)
    
    top_cities = closest_cities.sort_values(by="pred_score", ascending=False)
    return top_cities[["City","State","pred_score","user_distance"]]

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def hydrogen_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            print(data)
            user_lat = float(data.get("lat"))
            user_lon = float(data.get("lon"))
        except (ValueError, TypeError, KeyError, json.JSONDecodeError):
            return JsonResponse({"error": "Invalid or missing lat/lon"}, status=400)

        top5 = recommend_cities(user_lat, user_lon)
        return JsonResponse(top5.to_dict(orient="records"), safe=False)

    return JsonResponse({"error": "POST request required"}, status=405)
