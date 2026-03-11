import React, { useState } from "react";
import LoadingOverlay from "./ResponseWaiting";
import { MapPin, Globe, Navigation, Search } from 'lucide-react';

const GeoCheckDemo = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loader, setLoader] = useState(false);

  const handleCheck = () => {
    if (!latitude || !longitude) {
      alert("Please enter both latitude and longitude!");
      return;
    }

    setLoader(true);

    fetch(`${process.env.REACT_APP_BACKEND_URL}/check-geo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lat: latitude, lon: longitude }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setLoader(false);
        alert(data.message);
      })
      .catch((err) => {
        setLoader(false);
        console.error("Trouble in connecting to the Server: ", err);
        alert("Trouble in connecting to the Server! Please try again later.");
      });
  };

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in-up min-h-[75vh] flex items-center justify-center">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-secondary/20 text-secondary-light mb-4 ring-1 ring-secondary/50">
            <Globe size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Geo-Location Validator</h2>
          <p className="text-gray-600 dark:text-gray-400">Verify coordinates against the blockchain ledger.</p>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-secondary/20 rounded-full blur-xl"></div>

          <div className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Latitude</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-secondary transition-colors">
                  <MapPin size={18} />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-background-darker/50 border border-gray-300 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                  placeholder="Enter Latitude (e.g. 12.9716)"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Longitude</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-secondary transition-colors">
                  <Navigation size={18} />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-background-darker/50 border border-gray-300 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                  placeholder="Enter Longitude (e.g. 77.5946)"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                />
              </div>
            </div>

            <button
              className="w-full btn-primary-gradient py-4 flex items-center justify-center gap-2 group shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all mt-4"
              onClick={handleCheck}
              disabled={loader}
            >
              {loader ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Validating...
                </span>
              ) : (
                <>
                  <Search size={20} />
                  <span>Validate Coordinates</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <LoadingOverlay isVisible={loader} />
    </div>
  );
};

export default GeoCheckDemo;
