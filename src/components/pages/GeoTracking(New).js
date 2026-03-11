
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as turf from "@turf/turf"; // Install turf using npm install @turf/turf

const GeoCheckDemo = () => {
  const mapRef = useRef(null); // Reference to the map container
  const [map, setMap] = useState(null); // Leaflet map instance
  const [marker1, setMarker1] = useState(null); // Marker for first location
  const [marker2, setMarker2] = useState(null); // Marker for second location
  const [routeLine, setRouteLine] = useState(null); // Polyline for the route
  const [geoFence, setGeoFence] = useState(null); // Geo-fence polygon
  const [response, setResponse] = useState(""); // Geocoding responses
  const [buffer, setBuffer] = useState(null); // Turf buffer object for the geo-fence
  const [geoFenceCoords, setGeoFenceCoords] = useState([]); // Store geo-fence coordinates
  const [allLatLngsWithinBuffer, setAllLatLngsWithinBuffer] = useState([]); // Store all lat/lng within the buffer

  // Initialize the map
  useEffect(() => {
    if (!mapRef.current) return;

    const initialMap = L.map(mapRef.current).setView([51.505, -0.09], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(initialMap);

    setMap(initialMap);

    return () => {
      initialMap.remove(); // Cleanup the map on unmount
    };
  }, []);

  // Handle geocoding for two locations and draw the route
  const handleRoute = async (location1, location2) => {
    if (!location1 || !location2) {
      alert("Please enter both locations.");
      return;
    }

    try {
      // Geocode the first location
      const response1 = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          location1
        )}&format=json`
      );
      const data1 = await response1.json();

      if (data1.length === 0) {
        alert(`No results found for ${location1}.`);
        return;
      }

      // Geocode the second location
      const response2 = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          location2
        )}&format=json`
      );
      const data2 = await response2.json();

      if (data2.length === 0) {
        alert(`No results found for ${location2}.`);
        return;
      }

      const point1 = [parseFloat(data1[0].lat), parseFloat(data1[0].lon)];
      const point2 = [parseFloat(data2[0].lat), parseFloat(data2[0].lon)];

      // Update the map and markers
      if (map) {
        map.setView(point1, 6);

        if (marker1) {
          marker1.setLatLng(point1);
        } else {
          const newMarker1 = L.marker(point1, { draggable: true }).addTo(map);
          newMarker1.on("drag", checkDrag);
          setMarker1(newMarker1);
        }

        if (marker2) {
          marker2.setLatLng(point2);
        } else {
          const newMarker2 = L.marker(point2).addTo(map);
          setMarker2(newMarker2);
        }

        // Draw a polyline between the two points
        if (routeLine) {
          routeLine.setLatLngs([point1, point2]);
        } else {
          const newRouteLine = L.polyline([point1, point2], {
            color: "blue",
            weight: 4,
          }).addTo(map);
          setRouteLine(newRouteLine);
        }

        // Create a geo-fence (buffer) around the route
        const line = turf.lineString([
          [point1[1], point1[0]], // Turf uses [lon, lat]
          [point2[1], point2[0]],
        ]);
        const buffered = turf.buffer(line, 10, { units: "kilometers" }); // 10 km buffer
        setBuffer(buffered);

        // Convert the geo-fence to Leaflet format
        const geoFenceCoords = buffered.geometry.coordinates[0].map(
          ([lon, lat]) => [lat, lon]
        );

        // Update the geo-fence coordinates state
        setGeoFenceCoords(geoFenceCoords);

        if (geoFence) {
          geoFence.setLatLngs(geoFenceCoords);
        } else {
          const newGeoFence = L.polygon(geoFenceCoords, {
            color: "red",
            weight: 2,
            fillOpacity: 0.3,
          }).addTo(map);
          setGeoFence(newGeoFence);
        }

        // Extract all latitudes and longitudes within the buffer
        const coordinates = buffered.geometry.coordinates[0];
        setAllLatLngsWithinBuffer(coordinates);
      }

      // Update the response state with geocoded data
      setResponse(
        `Start: ${JSON.stringify(data1[0], null, 2)}\n\nEnd: ${JSON.stringify(
          data2[0],
          null,
          2
        )}`
      );
    } catch (error) {
      console.error("Error fetching geocoding data:", error);
      alert("An error occurred while fetching the route.");
    }
  };

  // Handle drag event and check if the marker is inside the geo-fence
  const checkDrag = () => {
    if (buffer && marker1) {
      const markerLatLng = marker1.getLatLng();
      const markerPoint = turf.point([markerLatLng.lng, markerLatLng.lat]);

      const isInside = turf.booleanPointInPolygon(markerPoint, buffer);

      if (!isInside) {
        alert("Marker is outside the geo-fence!");
      }
    }
  };

  // Clear all data
  const handleClear = () => {
    setResponse("");
    setAllLatLngsWithinBuffer([]); // Clear the stored coordinates as well
    if (marker1) {
      marker1.remove();
      setMarker1(null);
    }
    if (marker2) {
      marker2.remove();
      setMarker2(null);
    }
    if (routeLine) {
      routeLine.remove();
      setRouteLine(null);
    }
    if (geoFence) {
      geoFence.remove();
      setGeoFence(null);
    }
    setBuffer(null);
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <div style={{ marginBottom: "10px", padding: "10px" }}>
        <input
          type="text"
          id="location1"
          placeholder="Enter first location"
          style={{
            padding: "8px",
            marginRight: "5px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="text"
          id="location2"
          placeholder="Enter second location"
          style={{
            padding: "8px",
            marginRight: "5px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={() =>
            handleRoute(
              document.getElementById("location1").value,
              document.getElementById("location2").value
            )
          }
          style={{
            padding: "8px 12px",
            backgroundColor: "#1a73e8",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Draw Route
        </button>
        <button
          onClick={handleClear}
          style={{
            padding: "8px 12px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginLeft: "5px",
          }}
        >
          Clear
        </button>
      </div>
      <div
        ref={mapRef}
        style={{
          height: "60%",
          width: "100%",
          marginBottom: "10px",
          border: "1px solid #ccc",
        }}
      ></div>
      <div
        style={{
          padding: "10px",
          backgroundColor: "#f9f9f9",
          border: "1px solid #ccc",
          borderRadius: "4px",
          maxHeight: "200px",
          overflowY: "auto",
          fontSize: "14px",
        }}
      >
        <strong>Geocoding Response:</strong>
        <pre>{response}</pre>

        <strong>Coordinates within Geo-fence:</strong>
        <pre>{JSON.stringify(allLatLngsWithinBuffer, null, 2)}</pre>
      </div>
    </div>
  );
};

export default GeoCheckDemo;

