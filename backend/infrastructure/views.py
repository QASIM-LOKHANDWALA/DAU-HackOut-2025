from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from db import MongoService   # your Mongo wrapper
from bson import json_util
import json


class EnergyPlantView(APIView):
    
    
    def get(self, request):
        """Fetch all energy plants from MongoDB"""
        mongo = MongoService()
        plants = mongo.find_all("energy_plants") 
        # <-- collection name

        # Convert BSON (like ObjectId, Decimal128) to JSON-safe types
        plants_json = json.loads(json_util.dumps(plants))
        print(plants_json)
        return Response(plants_json, status=status.HTTP_200_OK)
