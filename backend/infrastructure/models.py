from django.db import models

# Create your models here.
class EnergyPlant(models.Model):
    name = models.CharField(max_length=255)
    capacity = models.FloatField()
    end_use = models.CharField(max_length=255)
    consumption = models.FloatField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    status = models.CharField(max_length=50)
    location = models.CharField(max_length=255)