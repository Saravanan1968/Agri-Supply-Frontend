import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingPage from './Loading';
import { Package, Truck, Box, User, ArrowLeft, CheckCircle, Shield, AlertCircle, Calendar, Hash, Leaf, BellRing } from 'lucide-react';
import { Dcontext } from '../../context/DataContext';

const BatchDetail = () => {
  const { batchNumber } = useParams();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { isDriver, isReceiver } = useContext(Dcontext);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/get-shipments`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.shipments)) {
          // Find the shipment matching the shipmentId from the URL
          const found = data.shipments.find(
            s => s.shipmentId === batchNumber || s.shipmentId === String(batchNumber)
          );
          setShipment(found || null);
        } else {
          setShipment(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setShipment(null);
        setLoading(false);
      });
  }, [batchNumber]);

  if (loading) return <LoadingPage />;

  const StatusBadge = ({ status }) => {
    const colors = {
      'Delivered': 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30',
      'Shipped': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30',
      'Delayed': 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30',
      'In Transit': 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[status] || colors['Shipped']}`}>
        {status}
      </span>
    );
  };

  const handleUpdateStatus = async (status) => {
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/update-shipment-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ shipmentId: shipment.shipmentId, status })
      });
      const data = await res.json();
      if (data.success) {
        setShipment(prev => ({ ...prev, status }));
        alert(`Shipment status updated to ${status}`);
      } else {
        alert(data.message || 'Failed to update status.');
      }
    } catch {
      alert('Connection error. Please try again.');
    }
    setIsUpdatingStatus(false);
  };

  const handleNotifyDelay = async () => {
    await handleUpdateStatus('Delayed');

    setIsNotifying(true);
    const payload = {
      farmerName: `Admin, Manufacturer & Receiver (via URN: ${shipment.urn})`,
      farmerEmail: "techcrafters6@gmail.com",
      farmerPhone: "+919894271065",
      productName: `Shipment ${shipment.shipmentId}`,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      delayReason: "Highways blocked or unexpected transit obstruction.",
      shipmentId: shipment.shipmentId,
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
        alert('Notification successfully dispatched!');
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fade-in-up">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#2E7D32] dark:hover:text-[#4CAF50] transition-colors mb-6 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Shipments</span>
      </button>

      {!shipment ? (
        <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl shadow-lg p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">No Data Found</h3>
          <p className="text-gray-500 dark:text-gray-500 mt-2">
            Could not find any information for Shipment #{batchNumber}.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2E7D32] to-[#4CAF50] flex items-center justify-center shadow">
                    <Package className="text-white" size={20} />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Shipment #{shipment.shipmentId}
                  </h1>
                </div>
                <p className="text-gray-500 dark:text-gray-400 ml-13 pl-13">
                  Created: {new Date(shipment.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={shipment.status} />

                {isDriver && shipment.status !== 'Delivered' && (
                  <div className="flex items-center gap-2 border-l border-gray-100 dark:border-white/10 pl-4 ml-2">
                    <button
                      onClick={() => handleUpdateStatus('In Transit')}
                      disabled={isUpdatingStatus}
                      className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white rounded-xl transition-all text-sm font-bold shadow-sm"
                    >
                      In Transit
                    </button>
                    <button
                      onClick={handleNotifyDelay}
                      disabled={isNotifying || isUpdatingStatus}
                      className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-sm font-bold shadow-sm ${isNotifying
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white'
                        }`}
                    >
                      {isNotifying ? (
                        <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <BellRing size={16} className={isNotifying ? "" : "animate-pulse"} />
                      )}
                      Delay Alert
                    </button>
                  </div>
                )}

                {/* Receiver Actions */}
                {isReceiver && shipment.status !== 'Delivered' && (
                  <div className="flex items-center gap-2 border-l border-gray-100 dark:border-white/10 pl-4 ml-2">
                    <button
                      onClick={() => handleUpdateStatus('Delivered')}
                      disabled={isUpdatingStatus}
                      className="px-4 py-2 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white rounded-xl transition-all flex items-center gap-2 text-sm font-bold shadow-sm"
                    >
                      <CheckCircle size={16} />
                      Mark Received
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Leaf, label: 'Supplier URN', value: shipment.urn },
              { icon: User, label: 'Receiver', value: shipment.endUser },
              { icon: Truck, label: 'Transit Status', value: shipment.status },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2 text-sm">
                  <Icon size={15} className="text-[#4CAF50]" />
                  <span className="font-medium">{label}</span>
                </div>
                <div className="font-bold text-gray-800 dark:text-gray-100 font-mono text-sm truncate">{value}</div>
              </div>
            ))}
          </div>

          {/* Containers / Products */}
          <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4">
              <Box size={20} className="text-[#4CAF50]" />
              Products in Shipment ({shipment.containers?.length || 0})
            </h2>

            <div className="space-y-3">
              {shipment.containers && shipment.containers.length > 0 ? (
                shipment.containers.map((container, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl hover:border-[#4CAF50]/40 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#2E7D32]/10 flex items-center justify-center">
                        <Leaf size={18} className="text-[#4CAF50]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-gray-100">{container.produceName}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Container: {container.containerId} | Seal: {container.tamperSealNo}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm ml-13">
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                        <Package size={14} className="text-[#4CAF50]" />
                        <span>Qty: <strong>{container.quantity}</strong></span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                        <Calendar size={14} className="text-[#4CAF50]" />
                        <span>Mfg: {container.manufacturingDate}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                        <Calendar size={14} className="text-red-400" />
                        <span>Exp: {container.expiryDate}</span>
                      </div>
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${shipment.status === 'Delivered'
                        ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30'
                        : 'bg-red-100 text-red-600 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30'
                        }`}>
                        {shipment.status === 'Delivered' ? <Shield size={11} /> : <AlertCircle size={11} />}
                        {shipment.status === 'Delivered' ? 'Secured' : 'In Transit'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-6">No containers in this shipment.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchDetail;
