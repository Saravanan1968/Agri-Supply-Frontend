import React, { useState } from 'react'
import LoadingOverlay from './ResponseWaiting';
import { Mail, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';

function EmailStatus() {

  const [loader, setLoader] = useState(false)

  const handleUpdation = (value) => {
    setLoader(true);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/update-mailStatus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: value }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setLoader(false)
        alert(data.message);
      })
      .catch((err) => {
        setLoader(false)
        console.log("Trouble in connecting to the Server: ", err);
        alert("Trouble in connecting to the Server! Please try again later.");
      });
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 animate-fade-in-up">
      <div className="glass-card p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden max-w-lg w-full text-center">

        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-primary/50">
          <Mail size={40} className="text-primary-light" />
        </div>

        <h2 className='text-3xl font-bold text-white mb-2'>Email Notifications</h2>
        <p className='text-gray-400 mb-8'>Manage the emergency email trigger status for the system.</p>

        <div className="space-y-4">
          <button
            className='w-full p-4 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 hover:border-green-500/40 transition-all flex items-center justify-between group'
            onClick={() => handleUpdation(true)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle size={20} className="text-green-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white">Enable Notifications</h3>
                <p className="text-xs text-green-400/70">Activate emergency alerts</p>
              </div>
            </div>
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
          </button>

          <button
            className='w-full p-4 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 transition-all flex items-center justify-between group'
            onClick={() => handleUpdation(false)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <XCircle size={20} className="text-red-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white">Disable Notifications</h3>
                <p className="text-xs text-red-400/70">Deactivate emergency alerts</p>
              </div>
            </div>
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
          </button>
        </div>
      </div>
      <LoadingOverlay isVisible={loader} />
    </div>
  )
}

export default EmailStatus