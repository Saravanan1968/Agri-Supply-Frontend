import React, { useState, useEffect, useContext } from "react";
import LoadingPage from "./Loading";
import LoadingOverlay from "./ResponseWaiting";
import { Dcontext } from "../../context/DataContext";
import { Package, Hash, User, Truck, Shield, Leaf, Calendar, ChevronDown, CheckCircle } from "lucide-react";

const produceOptions = [
  "Produce - Organic Tomatoes",
  "Produce - Fresh Apples",
  "Produce - Wheat Grains",
  "Produce - Corn/Maize",
  "Dairy - Fresh Milk",
  "AgriSupply - Organic Fertilizer",
  "AgriSupply - Seed Packets",
  "Produce - Mangoes",
  "Produce - Rice",
  "Produce - Bananas",
];

const statusOptions = ["Shipped", "In Transit", "Delivered", "Pending", "Delayed"];

const CreateContainer = () => {
  const { currentUser, isManufacturer } = useContext(Dcontext);
  const [fetchedDevices, setFetchedDevices] = useState(null);
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    urn: "",
    shipmentId: "",
    endUser: "",
    containerId: "",
    tamperSealNo: "",
    status: "Shipped",
    produceName: produceOptions[0],
    quantity: "",
    manufacturingDate: "",
    expiryDate: "",
  });

  useEffect(() => {
    if (currentUser && currentUser.urn) {
      setForm(prev => ({ ...prev, urn: currentUser.urn }));
    }
  }, [currentUser]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/fetch-devices`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.success) setFetchedDevices(data.deviceData || []);
        else setFetchedDevices([]);
      })
      .catch(() => setFetchedDevices([]));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: "" }));
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.urn.trim()) errs.urn = "Supplier URN is required";
    if (!form.shipmentId.trim()) errs.shipmentId = "Shipment ID is required";
    if (!form.endUser.trim()) errs.endUser = "Receiver username is required";
    if (!form.containerId.trim()) errs.containerId = "IoT Container ID is required";
    if (!form.tamperSealNo.trim()) errs.tamperSealNo = "Tamper seal number is required";
    if (!form.quantity || Number(form.quantity) <= 0) errs.quantity = "Quantity must be greater than 0";
    if (!form.manufacturingDate) errs.manufacturingDate = "Harvest/Manufacturing date is required";
    if (!form.expiryDate) errs.expiryDate = "Expiry date is required";
    if (form.manufacturingDate && form.expiryDate && new Date(form.manufacturingDate) > new Date(form.expiryDate))
      errs.manufacturingDate = "Manufacturing date cannot be after expiry date";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoader(true);

    // Build containers array as backend expects
    const containers = [{
      containerId: form.containerId,
      tamperSealNo: form.tamperSealNo,
      produceName: form.produceName,
      quantity: Number(form.quantity),
      manufacturingDate: form.manufacturingDate,
      expiryDate: form.expiryDate,
    }];

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/create-shipment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          urn: form.urn,
          shipmentId: form.shipmentId,
          endUser: form.endUser,
          status: form.status,
          containers,
        }),
      });
      const data = await res.json();
      setLoader(false);
      alert(data.message);
      if (data.success) {
        setForm(prev => ({
          ...prev,
          shipmentId: "", endUser: "", containerId: "", tamperSealNo: "",
          status: "Shipped", produceName: produceOptions[0], quantity: "",
          manufacturingDate: "", expiryDate: "",
        }));
        window.location.href = "/";
      }
    } catch (err) {
      setLoader(false);
      alert("Trouble connecting to the server. Please try again.");
    }
  };

  if (fetchedDevices === null) return <LoadingPage />;

  const renderInputField = ({ label, name, type = "text", icon: Icon, placeholder, children }) => (
    <div key={name}>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4CAF50] pointer-events-none" />}
        {children || (
          <input
            type={type}
            name={name}
            value={form[name]}
            onChange={handleChange}
            placeholder={placeholder}
            className={`w-full ${Icon ? "pl-9" : "pl-4"} pr-4 py-2.5 rounded-xl border ${errors[name] ? "border-red-400 bg-red-50" : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/5"} text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 transition-all`}
          />
        )}
      </div>
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  const getDeviceOptions = () => {
    if (Array.isArray(fetchedDevices) && fetchedDevices.length > 0) {
      return fetchedDevices.map((d, i) => (
        <option key={i} value={d.id}>{d.id} – {d.name}</option>
      ));
    }
    // Fallback demo options when ThingSpeak isn't available
    return (
      <>
        <option value="325.7798">325.7798 – Tracking_Device_1</option>
        <option value="325.7799">325.7799 – Tracking_Device_2</option>
        <option value="325.7800">325.7800 – Tracking_Device_3</option>
      </>
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in-up">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#2E7D32] to-[#4CAF50] flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Truck className="text-white" size={30} />
        </div>
        <h2 className="text-3xl font-bold text-[#2E7D32] dark:text-[#4CAF50]">Create New Shipment</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Enter details to generate a new agricultural shipment on the blockchain.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl shadow-lg p-6 space-y-6">

        {/* Shipment Identification */}
        <div>
          <h3 className="flex items-center gap-2 text-[#2E7D32] dark:text-[#4CAF50] font-bold text-base mb-4">
            <Hash size={18} /> Shipment Identification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderInputField({ label: "Supplier URN", name: "urn", icon: Leaf, placeholder: "e.g. farm-urn-001" })}
            {renderInputField({ label: "Shipment ID", name: "shipmentId", icon: Package, placeholder: "e.g. SHP-004" })}
          </div>
        </div>

        <hr className="border-gray-100 dark:border-white/10" />

        {/* Logistics */}
        <div>
          <h3 className="flex items-center gap-2 text-[#2E7D32] dark:text-[#4CAF50] font-bold text-base mb-4">
            <Truck size={18} /> Logistics &amp; Shipping
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderInputField({ label: "Receiver/Client Username", name: "endUser", icon: User, placeholder: "e.g. john_receiver" })}

            {/* IoT Container ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">IoT Container ID</label>
              <div className="relative">
                <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4CAF50] pointer-events-none" />
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  name="containerId"
                  value={form.containerId}
                  onChange={handleChange}
                  className={`w-full pl-9 pr-8 py-2.5 rounded-xl border ${errors.containerId ? "border-red-400 bg-red-50" : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/5"} text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 appearance-none transition-all`}
                >
                  <option value="">Select IoT Device</option>
                  {getDeviceOptions()}
                </select>
              </div>
              {errors.containerId && <p className="text-red-500 text-xs mt-1">{errors.containerId}</p>}
            </div>

            {renderInputField({ label: "Tamper Seal Number", name: "tamperSealNo", icon: Shield, placeholder: "e.g. TS-001" })}

            {/* Delivery Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Delivery Status</label>
              <div className="relative">
                <CheckCircle size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4CAF50] pointer-events-none" />
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 appearance-none transition-all"
                >
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-100 dark:border-white/10" />

        {/* Product Details */}
        <div>
          <h3 className="flex items-center gap-2 text-[#2E7D32] dark:text-[#4CAF50] font-bold text-base mb-4">
            <Leaf size={18} /> Product Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Product Name</label>
              <div className="relative">
                <Leaf size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4CAF50] pointer-events-none" />
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  name="produceName"
                  value={form.produceName}
                  onChange={handleChange}
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 appearance-none transition-all"
                >
                  {produceOptions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            {renderInputField({ label: "Quantity", name: "quantity", type: "number", icon: Package, placeholder: "e.g. 50" })}
            {renderInputField({ label: "Harvest/Manufacturing Date", name: "manufacturingDate", type: "date", icon: Calendar })}
            {renderInputField({ label: "Expiry Date", name: "expiryDate", type: "date", icon: Calendar })}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:from-[#1B5E20] hover:to-[#388E3C] flex items-center justify-center gap-2 transition-all text-base"
        >
          <Truck size={20} />
          Create Shipment &amp; Register on Blockchain
        </button>
      </form>

      <LoadingOverlay isVisible={loader} />
    </div>
  );
};

export default CreateContainer;
