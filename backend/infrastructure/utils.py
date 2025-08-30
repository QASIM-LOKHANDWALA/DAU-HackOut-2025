import pandas as pd
from .models import EnergyPlant

def populateDb():
    file_path = 'backend/infrastructure/qwe.xlsx'

    try:
        df = pd.read_excel(file_path)
    except UnicodeDecodeError:
        try:
            df = pd.read_csv(file_path, encoding="latin-1", on_bad_lines="skip")
        except Exception:
            df = pd.read_excel(file_path, engine="openpyxl")

    for _, row in df.iterrows():
        if pd.isna(row["Latitude"]) or pd.isna(row["Longitude"]) or pd.isna(row["Production capacity MW/MWel"]) or pd.isna(row["Consumption capacity (tonnes/year)"]) or pd.isna(row["End Use"]):
            continue

        EnergyPlant.objects.create(
            name=str(row["Name"]).strip(),
            capacity=float(row["Production capacity MW/MWel"]),
            end_use=str(row["End Use"]).strip(),
            consumption=float(row["Consumption capacity (tonnes/year)"]),
            latitude=float(row["Latitude"]),
            longitude=float(row["Longitude"]),
            status=str(row["Status"]).strip(),
            location=str(row["Location"]).strip(),
        )
