import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Dcontext } from '../../context/DataContext';
import LoadingPage from './Loading';
import LoadingOverlay from './ResponseWaiting';
import { ArrowLeft, Package, User, Truck, Calendar, Lock, AlertTriangle, CheckCircle, Clock, Box, Hash } from 'lucide-react';

const ContainerDetail = () => {
  const { isAuth, isReceiver, isCheckpoint1, isCheckpoint2 } = useContext(Dcontext)
  const { containerId } = useParams();
  const [container, setContainer] = useState(null);
  const [loader, setLoader] = useState(false)
  const [note, setNote] = useState('')

  useEffect(() => {
    if (containerId) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/getContainerById`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({ id: containerId })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setContainer(data.container)
          } else {
            alert(data.message)
          }
        })
        .catch(err => {
          console.log('Trouble in connecting to the Server: ', err)
          alert("Trouble in connecting to the Server! Please try again later.")
        })
    }
  }, [containerId]);

  const handleUpdateStatus = () => {
    setLoader(true)
    fetch(`${process.env.REACT_APP_BACKEND_URL}/update-container`, {
      method: 'POST',
      headers: {
        "Content-type": "application/json"
      },
      credentials: 'include',
      body: JSON.stringify({ formData: container })
    })
      .then(res => res.json())
      .then(data => {
        setLoader(false)
        if (data.success) {
          alert(data.message)
          window.location.reload()
        } else {
          alert(data.message)
        }
      })
      .catch(err => {
        setLoader(false)
        console.log('Trouble in connecting to the Server: ', err)
        alert("Trouble in connecting to the Server! Please try again later.")
      })
  };

  const handleReportSubmission = () => {
    setLoader(true)
    if (note === '') {
      alert('Please enter a Note!');
      setLoader(false)
      return
    }
    fetch(`${process.env.REACT_APP_BACKEND_URL}/reportcheckpoint`, {
      method: 'POST',
      headers: {
        "Content-type": "application/json"
      },
      credentials: 'include',
      body: JSON.stringify({ formData: container, note: note })
    })
      .then(res => res.json())
      .then(data => {
        setLoader(false)
        if (data.success) {
          alert(data.message)
          window.location.reload()
        } else {
          alert(data.message)
        }
      })
      .catch(err => {
        setLoader(false)
        console.log('Trouble in connecting to the Server: ', err)
        alert("Trouble in connecting to the Server! Please try again later.")
      })
  }

  if (!container || isAuth === null) return <LoadingPage />;

  const InfoRow = ({ icon: Icon, label, value, isLink = false, highlight = false }) => (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
      <div className={`p-2 rounded-lg ${highlight ? 'bg-primary/20 text-primary-light' : 'bg-gray-800 text-gray-400'}`}>
        <Icon size={20} />
      </div>
      <div className="flex-grow">
        <p className="text-sm text-gray-400 mb-1">{label}</p>
        {isLink ? (
          <button
            onClick={() => window.location.href = `/devices/2774098`}
            className="text-primary-light hover:text-primary hover:underline font-semibold text-lg text-left"
          >
            {value}
          </button>
        ) : (
          <p className="text-white font-semibold text-lg">{value}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in-up">
      <button
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
        onClick={() => window.location.href = `/`}
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Batches
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Details Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-8 rounded-3xl border border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-white/10">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Batch Details</h1>
                <p className="text-gray-400 flex items-center gap-2">
                  <Box size={16} />
                  {container.id}
                </p>
              </div>
              <div className={`px-4 py-2 rounded-full border ${container.lockStatus === 'locked'
                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/20'
                } flex items-center gap-2 font-semibold`}>
                {container.lockStatus === 'locked' ? <Lock size={16} /> : <AlertTriangle size={16} />}
                {container.lockStatus === 'locked' ? 'Secure & Locked' : 'Unlocked / Tampered'}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <InfoRow icon={Package} label="produce Name" value={container.produceName} highlight />
              <InfoRow icon={Box} label="Quantity" value={container.quantity} />
              <InfoRow icon={User} label="Manufacturer" value={container.manufacturer} />
              <InfoRow icon={User} label="Receiver" value={container.receiver} />
              <InfoRow icon={Calendar} label="Mfg Date" value={container.manufacturingDate} />
              <InfoRow icon={Clock} label="Expiry Date" value={container.expiryDate} />
              <InfoRow icon={Hash} label="Tamper Seal" value={container.tamperSealNo} />
              <InfoRow icon={Box} label="IOT Container ID" value={container.containerId} isLink />
            </div>
          </div>
        </div>

        {/* Actions & Status Column */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="glass-card p-6 rounded-3xl border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Truck size={24} className="text-secondary-light" />
              shipment Status
            </h3>

            <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
              <div className="relative">
                <div className={`absolute -left-[37px] top-1 w-5 h-5 rounded-full border-2 ${['shipped', 'crossedcheckpoint1', 'crossedcheckpoint2', 'delivered'].includes(container.status)
                  ? 'bg-green-500 border-green-500'
                  : 'bg-background border-gray-600'
                  }`}>
                  {['shipped', 'crossedcheckpoint1', 'crossedcheckpoint2', 'delivered'].includes(container.status) && <CheckCircle size={12} className="text-black m-0.5" />}
                </div>
                <h4 className="text-white font-medium">Shipped</h4>
                <p className="text-sm text-gray-500">Left Manufacturer</p>
              </div>

              <div className="relative">
                <div className={`absolute -left-[37px] top-1 w-5 h-5 rounded-full border-2 ${['crossedcheckpoint1', 'crossedcheckpoint2', 'delivered'].includes(container.status)
                  ? 'bg-green-500 border-green-500'
                  : 'bg-background border-gray-600'
                  }`}>
                  {['crossedcheckpoint1', 'crossedcheckpoint2', 'delivered'].includes(container.status) && <CheckCircle size={12} className="text-black m-0.5" />}
                </div>
                <h4 className="text-white font-medium">Checkpoint 1</h4>
                <p className="text-sm text-gray-500">Intermediate Scan</p>
              </div>

              <div className="relative">
                <div className={`absolute -left-[37px] top-1 w-5 h-5 rounded-full border-2 ${['crossedcheckpoint2', 'delivered'].includes(container.status)
                  ? 'bg-green-500 border-green-500'
                  : 'bg-background border-gray-600'
                  }`}>
                  {['crossedcheckpoint2', 'delivered'].includes(container.status) && <CheckCircle size={12} className="text-black m-0.5" />}
                </div>
                <h4 className="text-white font-medium">Checkpoint 2</h4>
                <p className="text-sm text-gray-500">Intermediate Scan</p>
              </div>

              <div className="relative">
                <div className={`absolute -left-[37px] top-1 w-5 h-5 rounded-full border-2 ${container.status === 'delivered'
                  ? 'bg-green-500 border-green-500'
                  : 'bg-background border-gray-600'
                  }`}>
                  {container.status === 'delivered' && <CheckCircle size={12} className="text-black m-0.5" />}
                </div>
                <h4 className="text-white font-medium">Delivered</h4>
                <p className="text-sm text-gray-500">Reached Receiver</p>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          {(isCheckpoint1 || isCheckpoint2 || isReceiver) && (
            <div className="glass-card p-6 rounded-3xl border border-white/10 bg-primary/5">
              <h3 className="text-xl font-bold text-white mb-4">Actions</h3>

              <div className="space-y-4">
                {isCheckpoint1 && (
                  <>
                    <button
                      className={`w-full py-3 rounded-xl font-semibold transition-all ${container.status === 'crossedcheckpoint1'
                        ? 'bg-white/10 text-gray-400 cursor-not-allowed'
                        : 'btn-primary-gradient shadow-lg shadow-primary/20'
                        }`}
                      disabled={container.status === 'crossedcheckpoint1'}
                      onClick={handleUpdateStatus}
                    >
                      {container.status === 'crossedcheckpoint1' ? 'Checkpoint 1 Passed' : 'Mark Checkpoint 1'}
                    </button>

                    <div className="pt-4 border-t border-white/10">
                      <textarea
                        className="w-full glass-input bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm mb-2 focus:ring-2 focus:ring-red-500/50"
                        placeholder="Report Malfunction Details..."
                        rows={3}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      ></textarea>
                      <button
                        className="w-full py-2 rounded-xl font-medium border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
                        onClick={handleReportSubmission}
                        disabled={container.status === 'crossedcheckpoint1'}
                      >
                        <AlertTriangle size={16} />
                        Report Malfunction
                      </button>
                    </div>
                  </>
                )}

                {isCheckpoint2 && (
                  <>
                    <button
                      className={`w-full py-3 rounded-xl font-semibold transition-all ${container.status === 'crossedcheckpoint2' || container.status === 'shipped'
                        ? 'btn-primary-gradient shadow-lg shadow-primary/20'
                        : 'bg-white/10 text-gray-400 cursor-not-allowed'
                        }`}
                      disabled={container.status === 'crossedcheckpoint2'}
                      onClick={handleUpdateStatus}
                    >
                      {container.status === 'crossedcheckpoint2' ? 'Checkpoint 2 Passed' : 'Mark Checkpoint 2'}
                    </button>
                    <div className="pt-4 border-t border-white/10">
                      <textarea
                        className="w-full glass-input bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm mb-2 focus:ring-2 focus:ring-red-500/50"
                        placeholder="Report Malfunction Details..."
                        rows={3}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      ></textarea>
                      <button
                        className="w-full py-2 rounded-xl font-medium border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
                        onClick={handleReportSubmission}
                        disabled={container.status === 'crossedcheckpoint2'}
                      >
                        <AlertTriangle size={16} />
                        Report Malfunction
                      </button>
                    </div>
                  </>
                )}

                {isReceiver && (
                  <button
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${container.status === 'delivered'
                      ? 'bg-white/10 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20'
                      }`}
                    disabled={container.status === 'delivered'}
                    onClick={handleUpdateStatus}
                  >
                    {container.status === 'delivered' ? 'Delivered Successfully' : 'Mark as Delivered'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <LoadingOverlay isVisible={loader} />
    </div>
  );
};

export default ContainerDetail;
