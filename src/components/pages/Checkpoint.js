import React, { useContext, useEffect, useState } from 'react'
import { Dcontext } from '../../context/DataContext'
import { ScanLine, Package, Truck, CheckCircle2, AlertTriangle, Search, Loader2, ChevronDown } from 'lucide-react'

const STATUS_OPTIONS = {
  driver: [
    { label: 'In Transit', value: 'In Transit', color: 'blue' },
    { label: 'Crossed Checkpoint', value: 'Crossed Checkpoint', color: 'green' },
    { label: 'Delivered', value: 'Delivered', color: 'emerald' },
    { label: 'Delayed', value: 'Delayed', color: 'yellow' },
  ],
  admin: [
    { label: 'Shipped', value: 'Shipped', color: 'blue' },
    { label: 'In Transit', value: 'In Transit', color: 'blue' },
    { label: 'Crossed Checkpoint', value: 'Crossed Checkpoint', color: 'green' },
    { label: 'Delivered', value: 'Delivered', color: 'emerald' },
    { label: 'Delayed', value: 'Delayed', color: 'yellow' },
  ]
}

const statusColor = (status) => {
  const map = {
    'Shipped': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30',
    'In Transit': 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30',
    'Crossed Checkpoint 1': 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30',
    'Crossed Checkpoint 2': 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-500/20 dark:text-teal-400 dark:border-teal-500/30',
    'Delivered': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30',
    'Delayed': 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30',
  }
  return map[status] || 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-500/20 dark:text-gray-400 dark:border-gray-500/30'
}

function Checkpoint() {
  const { isDriver, isAdmin } = useContext(Dcontext)
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [updating, setUpdating] = useState({})
  const [selectedStatus, setSelectedStatus] = useState({})
  const [feedback, setFeedback] = useState({})

  const myRole = isDriver ? 'driver' : isAdmin ? 'admin' : null
  const options = STATUS_OPTIONS[myRole] || STATUS_OPTIONS.admin

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/get-shipments`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success) setShipments(data.shipments || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleUpdate = async (shipmentId) => {
    const status = selectedStatus[shipmentId]
    if (!status) {
      setFeedback(prev => ({ ...prev, [shipmentId]: { ok: false, msg: 'Please select a status first.' } }))
      return
    }
    setUpdating(prev => ({ ...prev, [shipmentId]: true }))
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/update-shipment-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ shipmentId, status })
      })
      const data = await res.json()
      if (data.success) {
        setShipments(prev => prev.map(s => s.shipmentId === shipmentId ? { ...s, status } : s))
        setFeedback(prev => ({ ...prev, [shipmentId]: { ok: true, msg: `Status updated to "${status}" ✓` } }))
      } else {
        setFeedback(prev => ({ ...prev, [shipmentId]: { ok: false, msg: data.message } }))
      }
    } catch {
      setFeedback(prev => ({ ...prev, [shipmentId]: { ok: false, msg: 'Connection error. Try again.' } }))
    }
    setUpdating(prev => ({ ...prev, [shipmentId]: false }))
  }

  const filtered = shipments.filter(s =>
    s.shipmentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.urn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.endUser?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='container mx-auto px-4 py-6 animate-fade-in-up max-w-4xl'>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-tr from-[#2E7D32] to-[#4CAF50] text-white mb-4 shadow-lg">
          <ScanLine size={32} />
        </div>
        <h1 className="text-3xl font-extrabold text-[#2E7D32] dark:text-[#4CAF50] mb-2">
          Checkpoint Scanner
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          {isDriver && 'Driver — Mark shipments as In Transit, Crossed Checkpoint, or Delivered.'}
          {(!isDriver) && 'Update transit status for any shipment.'}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by Shipment ID, URN or Receiver…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 transition-all"
        />
      </div>

      {/* Shipment list */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <Loader2 size={32} className="animate-spin mx-auto mb-3" />
          Loading shipments…
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl">
          <Package size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">No shipments found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(s => (
            <div key={s.shipmentId}
              className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl shadow-sm p-5 transition-all hover:shadow-md">

              {/* Shipment info row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2E7D32]/20 to-[#4CAF50]/20 flex items-center justify-center">
                    <Package size={20} className="text-[#4CAF50]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base">
                      Shipment #{s.shipmentId}
                    </h3>
                    <p className="text-gray-400 text-xs">
                      URN: {s.urn} &nbsp;|&nbsp; Receiver: {s.endUser}
                    </p>
                  </div>
                </div>
                <span className={`self-start md:self-auto px-3 py-1 rounded-full text-xs font-semibold border ${statusColor(s.status)}`}>
                  {s.status}
                </span>
              </div>

              {/* Update controls */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow">
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <select
                    value={selectedStatus[s.shipmentId] || ''}
                    onChange={e => setSelectedStatus(prev => ({ ...prev, [s.shipmentId]: e.target.value }))}
                    className="w-full pl-3 pr-8 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-700 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 appearance-none transition-all"
                  >
                    <option value="">— Select new status —</option>
                    {options.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => handleUpdate(s.shipmentId)}
                  disabled={updating[s.shipmentId]}
                  className="flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white text-sm font-semibold hover:shadow-lg hover:from-[#1B5E20] hover:to-[#388E3C] transition-all disabled:opacity-60 whitespace-nowrap"
                >
                  {updating[s.shipmentId]
                    ? <Loader2 size={15} className="animate-spin" />
                    : <CheckCircle2 size={15} />
                  }
                  Update Status
                </button>
              </div>

              {/* Feedback message */}
              {feedback[s.shipmentId] && (
                <p className={`mt-2 text-xs font-medium flex items-center gap-1 ${feedback[s.shipmentId].ok ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                  {feedback[s.shipmentId].ok
                    ? <CheckCircle2 size={12} />
                    : <AlertTriangle size={12} />
                  }
                  {feedback[s.shipmentId].msg}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Checkpoint