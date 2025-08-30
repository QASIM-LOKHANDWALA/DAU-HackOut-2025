from django.urls import path
from . import views

urlpatterns = [
    path("plants/", views.EnergyPlantView.as_view())
]
