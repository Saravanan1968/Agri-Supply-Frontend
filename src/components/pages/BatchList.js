import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dcontext } from '../../context/DataContext';
import LoadingPage from './Loading';
import { Package, Calendar, User, Truck, Lock, Unlock, Search, Plus, Trash2, BellRing, CheckCircle } from 'lucide-react';

const BatchList = () => {
  const { isManufacturer, isDriver, isAdmin, isReceiver, currentUser } = useContext(Dcontext);
  const [batches, setBatches] = useState([]); // Standalone initialization
  const [searchTerm, setSearchTerm] = useState("");
  const [isNotifying, setIsNotifying] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    // Fetch real shipments from MongoDB
    fetch(`${process.env.REACT_APP_BACKEND_URL}/get-shipments`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.shipments) && data.shipments.length > 0) {
          // Map the MongoDB shape to what the table expects
          const mapped = data.shipments.map(s => ({
            id: s.shipmentId,
            timestamp: s.createdAt ? new Date(s.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
            urn: s.urn || '—',
            status: s.status || 'Shipped',
            lockStatus: s.status === 'Delivered' ? 'unlocked' : 'locked',
            endUser: s.endUser
          }));
          setBatches(mapped);
        } else {
          // Only show demo rows if user has created no real shipments yet
          setBatches([
            { id: "SHP-001", timestamp: new Date().toLocaleDateString(), urn: "AgriCorp", status: "Delivered", lockStatus: "unlocked" },
            { id: "SHP-002", timestamp: new Date().toLocaleDateString(), urn: "FreshFarms", status: "Shipped", lockStatus: "locked" },
            { id: "SHP-003", timestamp: new Date().toLocaleDateString(), urn: "GreenValley", status: "Delayed", lockStatus: "locked" }
          ]);
        }
      })
      .catch(() => {
        setBatches([
          { id: "SHP-001", timestamp: new Date().toLocaleDateString(), urn: "AgriCorp", status: "Delivered", lockStatus: "unlocked" },
          { id: "SHP-002", timestamp: new Date().toLocaleDateString(), urn: "FreshFarms", status: "Shipped", lockStatus: "locked" },
          { id: "SHP-003", timestamp: new Date().toLocaleDateString(), urn: "GreenValley", status: "Delayed", lockStatus: "locked" }
        ]);
      });
  }, []);

  const navPage = useNavigate();

  const handleRowClick = (batchNumber) => {
    navPage(`/shipment/${batchNumber}`); // routing changed mentally
  };

  const handleDelete = async (e, batchId) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete Shipment ${batchId}?`)) {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/delete-shipment/${batchId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        const data = await res.json();
        if (data.success) {
          alert(`Shipment ${batchId} deleted successfully.`);
        } else {
          alert(data.message || 'Failed to delete shipment.');
        }
      } catch {
        alert('Connection error. Please try again.');
      }
    }
  };

  const handleUpdateStatus = async (e, batchId, status) => {
    e.stopPropagation();
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/update-shipment-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ shipmentId: batchId, status })
      });
      const data = await res.json();
      if (data.success) {
        setBatches(prev => prev.map(b => b.id === batchId ? { ...b, status } : b));
        alert(`Shipment status updated to ${status}`);
      } else {
        alert(data.message || 'Failed to update status.');
      }
    } catch {
      alert('Connection error. Please try again.');
    }
    setIsUpdatingStatus(false);
  };

  const handleNotifyDelay = async (e, batch) => {
    e.stopPropagation();

    // 1. Update status in MongoDB
    await handleUpdateStatus(e, batch.id, 'Delayed');

    // 2. Send Delay Email/SMS to Admin, Manufacturer, and Receiver
    setIsNotifying(true);
    const payload = {
      farmerName: `Admin, Manufacturer & Receiver (via URN: ${batch.urn})`,
      farmerEmail: "techcrafters6@gmail.com",
      farmerPhone: "+919894271065",
      productName: `Shipment ${batch.id}`,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      delayReason: "Highways blocked or unexpected transit obstruction.",
      shipmentId: batch.id,
      driverContact: "+91 " + Math.floor(1000000000 + Math.random() * 9000000000)
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/notify-delay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        alert(`Notification successfully dispatched to ${batch.urn}!`);
      } else {
        alert('Failed to send notification: ' + data.message);
      }
    } catch (error) {
      console.error("Error triggering notification API", error);
      alert("Server Error: Make sure the backend is responding.");
    } finally {
      setIsNotifying(false);
    }
  };

  const filteredBatches = batches?.filter(batch => {
    // 1. Search term filter
    const matchesSearch = batch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.urn.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    // 2. Role-based visibility
    if (!currentUser) return false;

    if (isAdmin || isDriver) {
      return true; // Admins and drivers see everything
    } else if (isManufacturer) {
      return currentUser.urn && batch.urn.toLowerCase() === currentUser.urn.toLowerCase(); // Only their own URN
    } else if (isReceiver) {
      return currentUser.username && batch.endUser.toLowerCase() === currentUser.username.toLowerCase(); // Only assigned to them
    }

    return false;
  });

  if (batches === null) {
    return <LoadingPage />;
  } else {
    return (
      <div className="container mx-auto px-4 min-h-[70vh] animate-fade-in-up">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 shadow-sm bg-white dark:bg-background-lighter p-6 rounded-2xl border border-green-100 dark:border-white/10 transition-colors">
          <div>
            <h2 className="text-3xl font-bold text-[#2E7D32] dark:text-[#4CAF50] mb-2 font-sans transition-colors">Shipment Management</h2>
            <p className="text-gray-600 dark:text-gray-400 font-medium transition-colors">Manage and track your agricultural produce shipments</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search Shipment ID..."
                className="pl-10 pr-4 py-2 w-full md:w-64 bg-gray-50 dark:bg-background-darker border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#4CAF50]/50 text-gray-800 dark:text-gray-200 placeholder-gray-400 shadow-inner transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {isManufacturer && (
              <button
                className="bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:from-[#1B5E20] hover:to-[#388E3C] flex items-center gap-2 whitespace-nowrap transition-all font-medium"
                onClick={() => window.location.href = "/create-shipment"}
              >
                <Plus size={18} />
                <span>Log Shipment</span>
              </button>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-background-lighter overflow-hidden rounded-2xl shadow-lg border border-gray-100 dark:border-white/5 transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-background/80 transition-colors">
                  <th className="p-5 text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Package size={16} className="text-[#2E7D32] dark:text-primary-light" />
                      Shipment ID
                    </div>
                  </th>
                  <th className="p-5 text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-[#2E7D32] dark:text-primary-light" />
                      Logged At
                    </div>
                  </th>
                  <th className="p-5 text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-[#2E7D32] dark:text-primary-light" />
                      Supplier
                    </div>
                  </th>
                  <th className="p-5 text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Truck size={16} className="text-[#2E7D32] dark:text-primary-light" />
                      Transit Status
                    </div>
                  </th>
                  <th className="p-5 text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Lock size={16} className="text-[#2E7D32] dark:text-primary-light" />
                      Lock Status
                    </div>
                  </th>
                  <th className="p-5 text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {filteredBatches && filteredBatches.length === 0 && (
                  <tr>
                    <td className="p-8 text-center text-gray-500 dark:text-gray-400 font-medium transition-colors" colSpan={6}>
                      No Shipments found matching your search.
                    </td>
                  </tr>
                )}
                {filteredBatches && filteredBatches.map((batch, index) => (
                  <tr
                    key={index}
                    onClick={() => handleRowClick(batch.id)}
                    className="hover:bg-green-50/50 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <td className="p-5 text-gray-800 dark:text-gray-200 font-bold group-hover:text-[#2E7D32] dark:group-hover:text-[#4CAF50] transition-colors">
                      {batch.id}
                    </td>
                    <td className="p-5 text-gray-600 dark:text-gray-400 font-medium transition-colors">
                      {batch.timestamp}
                    </td>
                    <td className="p-5 text-gray-600 dark:text-gray-400 font-medium transition-colors">
                      {batch.urn}
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${batch.status === 'Delivered'
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : batch.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-700 border-blue-200'
                          : 'bg-amber-100 text-amber-700 border-amber-200'
                        }`}>
                        {batch.status}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2 font-medium">
                        {batch.lockStatus === 'locked' ? (
                          <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2.5 py-1 rounded-lg">
                            <Lock size={14} />
                            <span className="text-sm">Secured</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-red-500 bg-red-50 px-2.5 py-1 rounded-lg">
                            <Unlock size={14} />
                            <span className="text-sm">Unlocked</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        {/* Driver Actions: In Transit & Delayed */}
                        {isDriver && batch.status !== 'Delivered' && (
                          <>
                            <button
                              onClick={(e) => handleUpdateStatus(e, batch.id, 'In Transit')}
                              disabled={isUpdatingStatus}
                              className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white rounded-lg transition-all text-xs font-bold"
                              title="Mark as In Transit"
                            >
                              In Transit
                            </button>
                            <button
                              onClick={(e) => handleNotifyDelay(e, batch)}
                              disabled={isNotifying || isUpdatingStatus}
                              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold ${isNotifying
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white'
                                }`}
                              title="Mark as Delayed and Send Alerts"
                            >
                              {isNotifying ? (
                                <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                              ) : (
                                <BellRing size={14} className={isNotifying ? "" : "animate-pulse"} />
                              )}
                              Delay Alert
                            </button>
                          </>
                        )}

                        {/* Receiver Actions: Mark as Delivered */}
                        {isReceiver && batch.status !== 'Delivered' && (
                          <button
                            onClick={(e) => handleUpdateStatus(e, batch.id, 'Delivered')}
                            disabled={isUpdatingStatus}
                            className="px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold"
                            title="Mark as Received"
                          >
                            <CheckCircle size={14} />
                            Mark Received
                          </button>
                        )}

                        {/* Admin Action: Delete Delivered */}
                        {isAdmin && batch.status.toLowerCase() === 'delivered' && (
                          <button
                            onClick={(e) => handleDelete(e, batch.id)}
                            className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-all shadow-sm flex items-center gap-2"
                            title="Delete delivered shipment"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div >
      </div >
    );
  }
};

export default BatchList;
