import React, { useState, useEffect, useRef } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { MapPin, Factory, Zap, TrendingUp, Search, Filter } from "lucide-react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    LayersControl,
} from "react-leaflet";
import L from "leaflet";
import axiosInstance from "../../utils/axiosInstance";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const mockData = {
    hydrogenPlants: [
        {
            id: 1,
            name: "Reliance Jamnagar H2 Plant",
            lat: 22.4707,
            lng: 70.0577,
            capacity: 100,
            status: "operational",
            type: "production",
        },
        {
            id: 2,
            name: "Adani Mundra Green H2",
            lat: 22.8409,
            lng: 69.7192,
            capacity: 150,
            status: "planned",
            type: "production",
        },
        {
            id: 3,
            name: "NTPC Andhra Pradesh",
            lat: 17.385,
            lng: 78.4867,
            capacity: 200,
            status: "construction",
            type: "production",
        },
        {
            id: 4,
            name: "Indian Oil Mathura",
            lat: 27.4924,
            lng: 77.6737,
            capacity: 75,
            status: "operational",
            type: "production",
        },
        {
            id: 5,
            name: "BPCL Kochi Refinery",
            lat: 9.9312,
            lng: 76.2673,
            capacity: 90,
            status: "planned",
            type: "production",
        },
    ],
    demandCenters: [
        {
            id: 1,
            name: "Tata Steel Jamshedpur",
            lat: 22.8046,
            lng: 86.2029,
            demand: 50000,
            type: "steel",
            priority: "high",
        },
        {
            id: 2,
            name: "JSW Steel Vijayanagar",
            lat: 15.1394,
            lng: 76.4457,
            demand: 35000,
            type: "steel",
            priority: "medium",
        },
        {
            id: 3,
            name: "Gujarat Chemicals Vadodara",
            lat: 22.3072,
            lng: 73.1812,
            demand: 25000,
            type: "ammonia",
            priority: "high",
        },
        {
            id: 4,
            name: "Indian Railways Mumbai",
            lat: 19.076,
            lng: 72.8777,
            demand: 15000,
            type: "transport",
            priority: "medium",
        },
        {
            id: 5,
            name: "Fertilizer Corp Kanpur",
            lat: 26.4499,
            lng: 80.3319,
            demand: 20000,
            type: "fertilizer",
            priority: "low",
        },
    ],
    renewableSources: [
        {
            id: 1,
            name: "Gujarat Solar Park",
            lat: 23.0225,
            lng: 72.5714,
            capacity: 750,
            type: "solar",
            efficiency: 0.85,
        },
        {
            id: 2,
            name: "Rajasthan Wind Farm",
            lat: 26.9124,
            lng: 75.7873,
            capacity: 500,
            type: "wind",
            efficiency: 0.75,
        },
        {
            id: 3,
            name: "Tamil Nadu Offshore Wind",
            lat: 12.9716,
            lng: 80.2431,
            capacity: 400,
            type: "wind",
            efficiency: 0.8,
        },
        {
            id: 4,
            name: "Karnataka Solar Complex",
            lat: 15.3173,
            lng: 75.7139,
            capacity: 600,
            type: "solar",
            efficiency: 0.82,
        },
        {
            id: 5,
            name: "Maharashtra Wind Corridor",
            lat: 19.7515,
            lng: 75.7139,
            capacity: 350,
            type: "wind",
            efficiency: 0.78,
        },
    ],
    optimizedSites: [
        {
            id: 1,
            lat: 23.8103,
            lng: 77.4126,
            score: 94,
            cost: 450,
            roi: 18.5,
            name: "Recommended Site A",
        },
        {
            id: 2,
            lat: 21.2787,
            lng: 77.3773,
            score: 91,
            cost: 420,
            roi: 16.8,
            name: "Recommended Site B",
        },
        {
            id: 3,
            lat: 24.6637,
            lng: 73.3119,
            score: 88,
            cost: 480,
            roi: 15.2,
            name: "Recommended Site C",
        },
    ],
};

const HydrogenDashboard = () => {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [activeLayer, setActiveLayer] = useState("all");
    const [selectedSite, setSelectedSite] = useState(null);
    const [filterType, setFilterType] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [showOptimization, setShowOptimization] = useState(false);
    const [hydrogenPlantsResponse, setHydrogenPlants] = useState([]);

    // Mock Leaflet functionality for demo
    useEffect(() => {
        // In a real implementation, you would initialize Leaflet here
        console.log("Map would be initialized here with Leaflet");
        axiosInstance
            .get("plants/")
            .then((response) => {
                console.log(response.data);
                setHydrogenPlants(
                    response.data.filter(
                        (plant) =>
                            plant.latitude !== undefined &&
                            plant.longitude !== undefined
                    )
                );
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "Operational":
                return "bg-green-500";
            case "Construction":
                return "bg-yellow-500";
            case "Announced":
                return "bg-blue-500";
            default:
                return "bg-gray-500";
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case "production":
                return <Factory className="w-4 h-4" />;
            case "solar":
                return <Zap className="w-4 h-4 text-yellow-500" />;
            case "wind":
                return <Zap className="w-4 h-4 text-blue-500" />;
            case "steel":
                return <Factory className="w-4 h-4 text-red-500" />;
            case "ammonia":
                return <Factory className="w-4 h-4 text-purple-500" />;
            case "transport":
                return <TrendingUp className="w-4 h-4 text-green-500" />;
            default:
                return <MapPin className="w-4 h-4" />;
        }
    };

    const filteredPlants = hydrogenPlantsResponse.filter(
        (plant) =>
            (filterType === "all" || plant.status === filterType) &&
            plant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalCapacity = hydrogenPlantsResponse.reduce(
        (sum, plant) => sum + Number(plant.capacity || 0),
        0
    );

    const operationalPlants = hydrogenPlantsResponse.filter(
        (p) => p.status === "Operation"
    ).length;
    const totalDemand = mockData.demandCenters.reduce(
        (sum, center) => sum + center.demand,
        0
    );

    useEffect(() => {
        console.log("Filtered : ", filteredPlants);
        console.log("All Plants : ", hydrogenPlantsResponse);
    }, [filteredPlants, hydrogenPlantsResponse]);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">
                        Green Hydrogen Infrastructure Map
                    </h1>
                    <p className="mt-1">
                        Optimize infrastructure placement with AI-powered
                        insights
                    </p>
                </div>
                <Button
                    onClick={() => setShowOptimization(!showOptimization)}
                    className="bg-green-600 hover:bg-green-700"
                >
                    {showOptimization ? "Hide" : "Show"} AI Recommendations
                </Button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Capacity
                        </CardTitle>
                        <Factory className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {totalCapacity.toFixed(2)} MW
                        </div>
                        <p className="text-xs text-muted-foreground">
                            +12% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Operational Plants
                        </CardTitle>
                        <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {operationalPlants}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Out of {hydrogenPlantsResponse.length} total
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Demand
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {(totalDemand / 1000).toFixed(0)}K tons
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Annual projected demand
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Optimization Score
                        </CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">87%</div>
                        <p className="text-xs text-muted-foreground">
                            Network efficiency
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Map Section */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Infrastructure Map</CardTitle>
                            <div className="flex space-x-2">
                                <Select
                                    value={activeLayer}
                                    onValueChange={setActiveLayer}
                                >
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Select layer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Infrastructure
                                        </SelectItem>
                                        <SelectItem value="production">
                                            H2 Plants
                                        </SelectItem>
                                        <SelectItem value="demand">
                                            Demand Centers
                                        </SelectItem>
                                        <SelectItem value="renewable">
                                            Renewable Sources
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Mock Map Display */}
                        <MapContainer
                            center={[20.5937, 78.9629]} // Center of India
                            zoom={5}
                            className="h-96 w-full rounded-lg"
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            />

                            {/* Hydrogen Plants */}
                            {filteredPlants.map((plant) => (
                                <Marker
                                    key={plant.id}
                                    position={[plant.latitude, plant.longitude]}
                                >
                                    <Popup>
                                        <div className="p-2">
                                            <h3 className="font-medium">
                                                {plant.name}
                                            </h3>
                                            <p className="text-sm">
                                                Capacity: {plant.capacity} MW
                                            </p>
                                            <p className="text-sm">
                                                Status: {plant.status}
                                            </p>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}

                            {/* Demand Centers */}
                            {mockData.demandCenters.map((center) => (
                                <Marker
                                    key={center.id}
                                    position={[center.lat, center.lng]}
                                    icon={L.divIcon({
                                        className: "custom-demand-marker",
                                        html: '<div class="w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>',
                                        iconSize: [12, 12],
                                    })}
                                >
                                    <Popup>
                                        <div className="p-2">
                                            <h3 className="font-medium">
                                                {center.name}
                                            </h3>
                                            <p className="text-sm">
                                                Demand: {center.demand / 1000}K
                                                tons
                                            </p>
                                            <p className="text-sm">
                                                Industry: {center.type}
                                            </p>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>

                        {/* Map Controls */}
                        <div className="flex justify-between items-center mt-4">
                            <div className="flex space-x-4 text-sm">
                                <div className="flex items-center space-x-1">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span>Operational</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    <span>Under Construction</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span>Planned</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                    <span>Demand Centers</span>
                                </div>
                                {showOptimization && (
                                    <div className="flex items-center space-x-1">
                                        <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
                                        <span>AI Recommendations</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Side Panel */}
                <div className="space-y-6">
                    {/* Search and Filters */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Filters & Search
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search infrastructure..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-8"
                                />
                            </div>
                            <Select
                                value={filterType}
                                onValueChange={setFilterType}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Status
                                    </SelectItem>
                                    <SelectItem value="Operation">
                                        Operational
                                    </SelectItem>
                                    <SelectItem value="Construction">
                                        Under Construction
                                    </SelectItem>
                                    <SelectItem value="Announced">
                                        Announced
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    {/* AI Optimization Panel */}
                    {showOptimization && (
                        <Card className="border-purple-200 bg-purple-50">
                            <CardHeader>
                                <CardTitle className="text-lg text-purple-800">
                                    🤖 AI Recommendations
                                </CardTitle>
                                <CardDescription>
                                    Optimal sites for new infrastructure
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {mockData.optimizedSites.map(
                                        (site, index) => (
                                            <div
                                                key={site.id}
                                                className="p-3 bg-white rounded-lg border border-purple-200"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium text-sm">
                                                            {site.name}
                                                        </p>
                                                        <p className="text-xs text-gray-600">
                                                            Score: {site.score}
                                                            /100
                                                        </p>
                                                    </div>
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-purple-100 text-purple-800"
                                                    >
                                                        #{index + 1}
                                                    </Badge>
                                                </div>
                                                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                                    <div>
                                                        <span className="text-gray-500">
                                                            Cost:
                                                        </span>{" "}
                                                        ₹{site.cost}Cr
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">
                                                            ROI:
                                                        </span>{" "}
                                                        {site.roi}%
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Quick Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Network Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">
                                        Supply-Demand Balance
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className="text-green-600 border-green-600"
                                    >
                                        +15% Surplus
                                    </Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">
                                        Avg Transport Distance
                                    </span>
                                    <span className="text-sm font-medium">
                                        142 km
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">
                                        Network Efficiency
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className="text-blue-600 border-blue-600"
                                    >
                                        87%
                                    </Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">
                                        Cost Optimization
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className="text-purple-600 border-purple-600"
                                    >
                                        ₹2,400 Cr Saved
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Infrastructure Lists */}
            <Card>
                <CardHeader>
                    <CardTitle>Infrastructure Details</CardTitle>
                    <CardDescription>
                        Detailed view of all infrastructure components
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="plants" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="plants">
                                H2 Plants ({filteredPlants.length})
                            </TabsTrigger>
                            <TabsTrigger value="demand">
                                Demand Centers ({mockData.demandCenters.length})
                            </TabsTrigger>
                            <TabsTrigger value="renewable">
                                Renewable Sources (
                                {mockData.renewableSources.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="plants" className="mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredPlants.map((plant) => (
                                    <Card
                                        key={plant.id}
                                        className="cursor-pointer hover:shadow-md transition-shadow"
                                    >
                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center space-x-2">
                                                    {getTypeIcon(
                                                        plant.location
                                                    )}
                                                    <CardTitle className="text-sm">
                                                        {plant.name}
                                                    </CardTitle>
                                                </div>
                                                <Badge
                                                    className={`${getStatusColor(
                                                        plant.status
                                                    )} text-white text-xs`}
                                                >
                                                    {plant.status}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">
                                                        Capacity:
                                                    </span>
                                                    <span className="font-medium">
                                                        {plant.capacity} MW
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">
                                                        Location:
                                                    </span>
                                                    <span className="font-medium">
                                                        {plant.latitude},{" "}
                                                        {plant.longitude}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="demand" className="mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {mockData.demandCenters.map((center) => (
                                    <Card
                                        key={center.id}
                                        className="cursor-pointer hover:shadow-md transition-shadow"
                                    >
                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center space-x-2">
                                                    {getTypeIcon(center.type)}
                                                    <CardTitle className="text-sm">
                                                        {center.name}
                                                    </CardTitle>
                                                </div>
                                                <Badge
                                                    variant={
                                                        center.priority ===
                                                        "high"
                                                            ? "destructive"
                                                            : center.priority ===
                                                              "medium"
                                                            ? "secondary"
                                                            : "outline"
                                                    }
                                                >
                                                    {center.priority}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">
                                                        Annual Demand:
                                                    </span>
                                                    <span className="font-medium">
                                                        {(
                                                            center.demand / 1000
                                                        ).toFixed(0)}
                                                        K tons
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">
                                                        Industry:
                                                    </span>
                                                    <span className="font-medium capitalize">
                                                        {center.type}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="renewable" className="mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {mockData.renewableSources.map((source) => (
                                    <Card
                                        key={source.id}
                                        className="cursor-pointer hover:shadow-md transition-shadow"
                                    >
                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center space-x-2">
                                                    {getTypeIcon(source.type)}
                                                    <CardTitle className="text-sm">
                                                        {source.name}
                                                    </CardTitle>
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className="capitalize"
                                                >
                                                    {source.type}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">
                                                        Capacity:
                                                    </span>
                                                    <span className="font-medium">
                                                        {source.capacity} MW
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">
                                                        Efficiency:
                                                    </span>
                                                    <span className="font-medium">
                                                        {(
                                                            source.efficiency *
                                                            100
                                                        ).toFixed(0)}
                                                        %
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Optimization Results */}
            {showOptimization && (
                <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                    <CardHeader>
                        <CardTitle className="text-xl text-purple-800">
                            🎯 AI Optimization Results
                        </CardTitle>
                        <CardDescription>
                            Recommended infrastructure placements based on
                            multi-criteria analysis
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {mockData.optimizedSites.map((site, index) => (
                                <Card
                                    key={site.id}
                                    className="bg-white border-purple-200"
                                >
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-base">
                                                {site.name}
                                            </CardTitle>
                                            <Badge className="bg-purple-600 text-white">
                                                Score: {site.score}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <span className="text-gray-600">
                                                        Investment:
                                                    </span>
                                                    <p className="font-medium">
                                                        ₹{site.cost} Cr
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">
                                                        Expected ROI:
                                                    </span>
                                                    <p className="font-medium text-green-600">
                                                        {site.roi}%
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="pt-2 border-t">
                                                <p className="text-xs text-gray-600 mb-2">
                                                    Key Advantages:
                                                </p>
                                                <ul className="text-xs space-y-1">
                                                    <li>
                                                        • 45km from major
                                                        renewable hub
                                                    </li>
                                                    <li>
                                                        • Direct pipeline access
                                                        possible
                                                    </li>
                                                    <li>
                                                        • Government incentive
                                                        zone
                                                    </li>
                                                </ul>
                                            </div>
                                            <Button
                                                size="sm"
                                                className="w-full mt-3 bg-purple-600 hover:bg-purple-700"
                                                onClick={() =>
                                                    setSelectedSite(site)
                                                }
                                            >
                                                View Details
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default HydrogenDashboard;
