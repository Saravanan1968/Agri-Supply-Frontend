import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingPage from './Loading';
import { Cpu, Lock, Unlock, Calendar, ArrowRight, Search, Server } from 'lucide-react';

const DeviceList = () => {
  const navigate = useNavigate();
  const [fetchedDevices, setFetchedDevices] = useState(null)
  const [lockStatus, setLockStatus] = useState(null)
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/fetch-devices`, {
      method: 'GET',
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFetchedDevices(data.deviceData)
        }
        else {
          setFetchedDevices([])
        }
      })
      .catch(err => {
        setFetchedDevices([])
        console.log('Trouble in connecting to the Server: ', err)
        // alert("Trouble in connecting to the Server! Please try again later.")
      })
  }, [])


  useEffect(() => {
    if (fetchedDevices && fetchedDevices.feeds && fetchedDevices.feeds.length > 0) {
      const lastFeed = fetchedDevices.feeds[fetchedDevices.feeds.length - 1]; // Avoid splice to prevent mutation issues if re-rendered
      const status = lastFeed.field8 === '1.00000'
      setLockStatus(status)
    }
  }, [fetchedDevices])

  if (fetchedDevices === null) {
    return <LoadingPage />
  }

  // Filter logic (though currently it seems fetchedDevices is a single object or list? 
  // The original code treated fetchedDevices as a single object with 'channel' and 'feeds'. 
  // But the table rendering implies a list if it wasn't just showing ONE device. 
  // Looking at line 87: fetchedDevices.channel.id. 
  // It seems the API returns data for ONE channel/device or a specific structure.
  // The original code only rendered ONE row (lines 86-98). 
  // So I will maintain that behavior but style it.

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in-up min-h-[70vh]">
      <div className="glass-card rounded-3xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/20 text-primary-light">
              <Server size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">IoT Devices</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Monitor connected container modules</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5 text-left">
                <th className="p-4 text-gray-600 dark:text-gray-400 font-medium text-sm">Device ID</th>
                <th className="p-4 text-gray-600 dark:text-gray-400 font-medium text-sm">Lock Status</th>
                <th className="p-4 text-gray-600 dark:text-gray-400 font-medium text-sm">Last Heartbeat</th>
                <th className="p-4 text-gray-600 dark:text-gray-400 font-medium text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {fetchedDevices && fetchedDevices.channel ? (
                <tr className="hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 group-hover:bg-primary/20 group-hover:text-primary-light transition-colors">
                        <Cpu size={20} />
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">{fetchedDevices.channel.id}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${lockStatus
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                      {lockStatus ? <Lock size={12} /> : <Unlock size={12} />}
                      {lockStatus ? 'Locked' : 'Unlocked'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-400 text-sm">
                      <Calendar size={14} />
                      {fetchedDevices.feeds && fetchedDevices.feeds.length > 0 ? fetchedDevices.feeds[fetchedDevices.feeds.length - 1].created_at : 'N/A'}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => navigate(`/devices/${fetchedDevices.channel.id}`)}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 hover:text-primary-light transition-colors"
                      title="View Details"
                    >
                      <ArrowRight size={20} />
                    </button>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No active IoT devices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeviceList;
