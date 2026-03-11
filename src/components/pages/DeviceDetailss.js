import React, { useEffect, useState } from "react";
import LoadingPage from "./Loading";
import {
  Activity, MapPin, Lock, Unlock,
  Calendar, Cloud, X
} from 'lucide-react';

const DeviceDetails = () => {

  const [deviceInfo, setDeviceInfo] = useState(null)
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [channel, setChannel] = useState(null)
  const [feeds, setFeeds] = useState(null)

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/fetch-devices`, {
      method: 'GET',
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDeviceInfo(data.deviceData)
        }
        else {
          setDeviceInfo([])
        }
      })
      .catch(err => {
        setDeviceInfo([])
        console.log('Trouble in connecting to the Server: ', err)
      })
  }, [])

  useEffect(() => {
    if (deviceInfo !== null && deviceInfo.channel) {
      setChannel(deviceInfo.channel)
      setFeeds(deviceInfo.feeds || [])
    }
  }, [deviceInfo])


  if (deviceInfo === null) {
    return <LoadingPage />
  }
  else if (deviceInfo.length === 0 || !channel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="p-4 rounded-full bg-white/5 mb-4">
          <Cloud size={48} className="text-gray-500" />
        </div>
        <h2 className="text-xl font-bold text-white">No Device Data Found</h2>
        <p className="text-gray-400">Unable to retrieve IoT telemetry data.</p>
      </div>
    )
  }
  else {
    const lastFeed = feeds.length > 0 ? feeds[feeds.length - 1] : null;
    const isLocked = lastFeed && Number(lastFeed.field3) <= 75;

    return (
      <div className="container mx-auto px-4 py-8 animate-fade-in-up">
        {/* Header Section */}
        <div className="glass-card p-8 rounded-3xl border border-white/10 mb-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-20 hidden md:block">
            <Activity size={120} className="text-primary-light" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-3 h-3 rounded-full ${isLocked ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">IoT Device Telemetry</span>
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-6">
              {channel.name}
              <span className="text-lg text-gray-500 font-normal ml-3">#{channel.id}</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5">
                <div className="p-2 rounded-lg bg-primary/20 text-primary-light">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="font-mono text-sm text-gray-200">{new Date(channel.updated_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5">
                <div className={`p-2 rounded-lg ${isLocked ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-500'}`}>
                  {isLocked ? <Lock size={20} /> : <Unlock size={20} />}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Lock Status</p>
                  <p className={`font-bold text-sm ${isLocked ? 'text-green-400' : 'text-red-400'}`}>
                    {isLocked ? 'Securely Locked' : 'Unlocked / Tampered'}
                  </p>
                </div>
              </div>

              {lastFeed && (
                <button
                  className="flex items-center gap-3 p-4 rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/20 transition-all text-left group"
                  onClick={() => window.open(`https://www.google.com/maps?q=${lastFeed.field6},${lastFeed.field7}`)}
                >
                  <div className="p-2 rounded-lg bg-primary text-white">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-primary-light group-hover:text-white transition-colors">Current Location</p>
                    <p className="font-mono text-sm text-gray-200 flex items-center gap-1 group-hover:underline">
                      View Map
                    </p>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Telemetry Feed History</h3>
          <span className="text-sm text-gray-400">{feeds.length} entries</span>
        </div>

        {/* Feeds List */}
        <div className="glass-card rounded-3xl border border-white/10 overflow-hidden max-h-[600px] overflow-y-auto custom-scrollbar">
          <table className="w-full">
            <thead className="sticky top-0 bg-background-darker/95 backdrop-blur-md z-10">
              <tr className="text-left border-b border-white/10">
                <th className="p-4 text-gray-400 font-medium text-sm">Timestamp</th>
                <th className="p-4 text-gray-400 font-medium text-sm">Vibration</th>
                <th className="p-4 text-gray-400 font-medium text-sm">Coordinates</th>
                <th className="p-4 text-gray-400 font-medium text-sm text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {feeds.slice().reverse().map((feed, index) => (
                <tr
                  key={index}
                  onClick={() => setSelectedFeed(feed)}
                  className="hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <td className="p-4">
                    <span className="font-mono text-sm text-gray-300">{new Date(feed.created_at).toLocaleString()}</span>
                  </td>
                  {/* <td className="p-4">
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="flex items-center gap-1 text-orange-400"><Thermometer size={14} /> {feed.field4}°C</span>
                                            <span className="flex items-center gap-1 text-blue-400"><Droplets size={14} /> {feed.field5}%</span>
                                        </div>
                                    </td> */}
                  <td className="p-4">
                    <span className="text-xs text-gray-400 font-mono">
                      V:{feed.field1 ? Number(feed.field1).toFixed(1) : '0.0'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                      <MapPin size={12} />
                      {feed.field6 ? Number(feed.field6).toFixed(4) : 'N/A'}, {feed.field7 ? Number(feed.field7).toFixed(4) : 'N/A'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border ${Number(feed.field3) <= 75
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                      {Number(feed.field3) <= 75 ? 'Locked' : 'Open'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Styled Modal */}
        {selectedFeed && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedFeed(null)}>
            <div className="glass-card text-white w-full max-w-lg rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
              {/* Decorative gradients */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Data Point Details</h3>
                  <p className="text-sm text-gray-400 font-mono">{new Date(selectedFeed.created_at).toLocaleString()}</p>
                </div>
                <button onClick={() => setSelectedFeed(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <div className={`flex items-center gap-2 font-bold ${Number(selectedFeed.field3) <= 75 ? 'text-green-400' : 'text-red-400'}`}>
                      {Number(selectedFeed.field3) <= 75 ? <Lock size={18} /> : <Unlock size={18} />}
                      {Number(selectedFeed.field3) <= 75 ? 'Locked' : 'Unlocked'}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-xs text-gray-500 mb-1">Light Sensor (LDR)</p>
                    <p className="text-lg font-mono font-bold">{selectedFeed.field3 || '0'}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-xs text-gray-500 mb-1">Vibration</p>
                    <p className="text-lg font-mono font-bold">{selectedFeed.field1 || '0'}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Geolocation</p>
                      <div className="flex items-center gap-2 font-mono text-sm">
                        <span className="px-2 py-1 rounded bg-black/20">Lat: {selectedFeed.field6 || 'N/A'}</span>
                        <span className="px-2 py-1 rounded bg-black/20">Lon: {selectedFeed.field7 || 'N/A'}</span>
                      </div>
                    </div>
                    <MapPin size={20} className="text-primary-light" />
                  </div>
                  <button
                    onClick={() => window.open(`https://www.google.com/maps?q=${selectedFeed.field6},${selectedFeed.field7}`)}
                    className="w-full mt-3 py-2 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary-light text-sm font-medium transition-colors border border-primary/20"
                  >
                    Open in Google Maps
                  </button>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button onClick={() => setSelectedFeed(null)} className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors">
                  Close Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default DeviceDetails;
