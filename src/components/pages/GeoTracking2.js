import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as turf from "@turf/turf";
import { Map, Navigation, Trash2, Search, MapPin } from 'lucide-react';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const GeoCheckDemo2 = () => {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [marker1, setMarker1] = useState(null);
    const [marker2, setMarker2] = useState(null);
    const [routeLine, setRouteLine] = useState(null);
    const [geoFence, setGeoFence] = useState(null);
    const [response, setResponse] = useState("");
    const [buffer, setBuffer] = useState(null);
    const [geoFenceCoords, setGeoFenceCoords] = useState([]);
    const [loading, setLoading] = useState(false);

    // Initialize the map
    useEffect(() => {
        if (!mapRef.current) return;

        const initialMap = L.map(mapRef.current).setView([51.505, -0.09], 5);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
        }).addTo(initialMap);

        setMap(initialMap);

        return () => {
            initialMap.remove();
        };
    }, []);

    const handleRoute = async (location1, location2) => {
        if (!location1 || !location2) {
            alert("Please enter both locations.");
            return;
        }

        setLoading(true);

        try {
            const response1 = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location1)}&format=json`
            );
            const data1 = await response1.json();

            if (data1.length === 0) {
                alert(`No results found for ${location1}.`);
                setLoading(false);
                return;
            }

            const response2 = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location2)}&format=json`
            );
            const data2 = await response2.json();

            if (data2.length === 0) {
                alert(`No results found for ${location2}.`);
                setLoading(false);
                return;
            }

            const point1 = [parseFloat(data1[0].lat), parseFloat(data1[0].lon)];
            const point2 = [parseFloat(data2[0].lat), parseFloat(data2[0].lon)];

            if (map) {
                map.setView(point1, 6);

                if (marker1) marker1.setLatLng(point1);
                else setMarker1(L.marker(point1, { draggable: true }).addTo(map));

                if (marker2) marker2.setLatLng(point2);
                else setMarker2(L.marker(point2).addTo(map));

                if (routeLine) routeLine.setLatLngs([point1, point2]);
                else setRouteLine(L.polyline([point1, point2], { color: "blue", weight: 4 }).addTo(map));

                const line = turf.lineString([[point1[1], point1[0]], [point2[1], point2[0]]]);
                const buffered = turf.buffer(line, 10, { units: "kilometers" });
                setBuffer(buffered);

                const geoFenceCoords = buffered.geometry.coordinates[0].map(([lon, lat]) => [lat, lon]);
                setGeoFenceCoords(geoFenceCoords);

                if (geoFence) geoFence.setLatLngs(geoFenceCoords);
                else setGeoFence(L.polygon(geoFenceCoords, { color: "red", weight: 2, fillOpacity: 0.3 }).addTo(map));

                map.off("click"); // Remove previous listeners
                map.on("click", (e) => {
                    const clickedPoint = turf.point([e.latlng.lng, e.latlng.lat]);
                    const isInsideBuffer = turf.booleanPointInPolygon(clickedPoint, buffered);

                    if (isInsideBuffer) {
                        alert(`Point Selected: Latitude ${e.latlng.lat}, Longitude ${e.latlng.lng}`);
                    } else {
                        // Check geo-fence violation via backend
                        try {
                            fetch(`${process.env.REACT_APP_BACKEND_URL}/check-geo`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ lat: e.latlng.lat, lon: e.latlng.lng, containerId: "MANUAL_CHECK" }), // Sending dummy ID or could monitor specific container
                                credentials: "include",
                            })
                                .then((res) => res.json())
                                .then((data) => {
                                    alert(data.message || "Alert sent!");
                                })
                                .catch(() => alert("Clicked point is outside the red region (Geo-Fence). Alert Failed."));
                        } catch (e) {
                            alert("Clicked point is outside the red region (Geo-Fence).");
                        }
                    }
                });
            }

            setResponse(`Start: ${data1[0].display_name}\nEnd: ${data2[0].display_name}`);
        } catch (error) {
            console.error("Error fetching geocoding data:", error);
            alert("An error occurred while fetching the route.");
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setResponse("");
        if (marker1) { marker1.remove(); setMarker1(null); }
        if (marker2) { marker2.remove(); setMarker2(null); }
        if (routeLine) { routeLine.remove(); setRouteLine(null); }
        if (geoFence) { geoFence.remove(); setGeoFence(null); }
        setBuffer(null);
        if (map) map.off("click");
    };

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in-up flex flex-col min-h-[85vh]">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-4 rounded-full bg-green-50 text-[#2E7D32] mb-4 border border-green-200 shadow-sm">
                    <Map size={36} />
                </div>
                <h2 className="text-4xl font-extrabold text-[#2E7D32] mb-3">Geo-Fencing Route Monitor</h2>
                <p className="text-gray-600 font-medium text-lg">Define a route and monitor valid deviations within a 10km agricultural buffer zone.</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl mb-6">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2E7D32] transition-colors">
                            <MapPin size={18} />
                        </div>
                        <input
                            type="text"
                            id="location1"
                            placeholder="Enter Start Location (e.g. Farm Source)"
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/50 focus:border-[#2E7D32] text-gray-800 placeholder-gray-400 transition-all shadow-sm"
                        />
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2E7D32] transition-colors">
                            <Navigation size={18} />
                        </div>
                        <input
                            type="text"
                            id="location2"
                            placeholder="Enter Destination (e.g. Processing Plant)"
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/50 focus:border-[#2E7D32] text-gray-800 placeholder-gray-400 transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => handleRoute(
                            document.getElementById("location1").value,
                            document.getElementById("location2").value
                        )}
                        disabled={loading}
                        className="flex-1 bg-[#2E7D32] hover:bg-[#1B5E20] text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-green-900/20 hover:shadow-green-900/30 transition-all transform hover:-translate-y-1"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <>
                                <Search size={18} />
                                <span>Generate Route & Fence</span>
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleClear}
                        className="px-6 py-3 rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all flex items-center gap-2 font-semibold shadow-sm"
                    >
                        <Trash2 size={18} />
                        <span>Clear</span>
                    </button>
                </div>
            </div>

            <div className="bg-white p-2 rounded-3xl border border-gray-100 shadow-xl flex-grow overflow-hidden relative" style={{ minHeight: '500px' }}>
                <div ref={mapRef} className="w-full h-full rounded-2xl z-0" style={{ minHeight: '500px' }}></div>
            </div>

            {response && (
                <div className="mt-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Location Details</h3>
                    <pre className="text-sm font-medium text-gray-600 overflow-x-auto p-4 bg-gray-50 rounded-xl border border-gray-200">{response}</pre>
                </div>
            )}
        </div>
    );
};

export default GeoCheckDemo2;