import React, { useState } from 'react';
import LoadingOverlay from './ResponseWaiting';
import { UserPlus, User, Mail, Phone, Lock, Hash, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contact: '',
    username: '',
    role: '',
    password: '',
    confirmPassword: '',
    manufacturerUrn: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false)
  const [errors, setErrors] = useState({});

  // Validate email format
  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Validate contact number
  const validateContact = (contact) =>
    /^[0-9]{10}$/.test(contact);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.email.trim() || !validateEmail(formData.email))
      newErrors.email = 'Valid email is required';
    if (!formData.contact.trim() || !validateContact(formData.contact))
      newErrors.contact = 'Valid 10-digit contact number is required';
    if (!formData.username.trim())
      newErrors.username = 'Username is required';
    if (!formData.role.trim())
      newErrors.role = 'Role selection is required';
    if (formData.role === 'manufacturer' && !formData.manufacturerUrn.trim())
      newErrors.manufacturerUrn = 'Manufacturer URN is required';
    if (!formData.password.trim())
      newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = (e) => {
    setLoader(true)
    e.preventDefault();

    if (!validateForm()) {
      setLoader(false)
      return;
    }

    console.log('User data submitted:', formData);

    fetch(`${process.env.REACT_APP_BACKEND_URL}/create-user`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ formData }),
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setLoader(false)
        if (data.success) {
          alert(data.message)
          window.location.href = "/user-list"
        }
        else {
          alert(data.message)
        }
      })
      .catch(err => {
        setLoader(false)
        console.log('Trouble in connecting to the Server: ', err)
        alert("Trouble in connecting to the Server! Please try again later.")
      })

    // Reset form - typically done only on success or if needed, but keeping logic
    // setFormData({ ... });
    // setErrors({});
  };


  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in-up min-h-[80vh]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/20 text-primary-light mb-4 ring-1 ring-primary/50">
            <UserPlus size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create New User</h1>
          <p className="text-gray-600 dark:text-gray-400">Onboard new personnel to the supply chain platform.</p>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 -ml-10 -mt-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-primary transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-background-darker/50 border ${errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-white/10'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all`}
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.fullName && <p className="text-red-400 text-xs ml-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-primary transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-background-darker/50 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-white/10'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all`}
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs ml-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Contact Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-primary transition-colors">
                    <Phone size={18} />
                  </div>
                  <input
                    type="text"
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-background-darker/50 border ${errors.contact ? 'border-red-500' : 'border-gray-300 dark:border-white/10'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all`}
                    name="contact"
                    placeholder="9876543210"
                    value={formData.contact}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.contact && <p className="text-red-400 text-xs ml-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.contact}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-primary transition-colors">
                    <Hash size={18} />
                  </div>
                  <input
                    type="text"
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-background-darker/50 border ${errors.username ? 'border-red-500' : 'border-gray-300 dark:border-white/10'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all`}
                    name="username"
                    placeholder="johndoe123"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.username && <p className="text-red-400 text-xs ml-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.username}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Role</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-primary transition-colors">
                    <ShieldCheck size={18} />
                  </div>
                  <select
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-background-darker/50 border ${errors.role ? 'border-red-500' : 'border-gray-300 dark:border-white/10'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white transition-all appearance-none`}
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Select Role</option>
                    <option value="admin">Director General, NCB</option>
                    <option value="admin">Zonal Director, NCB</option>
                    <option value="manufacturer">Manufacturer</option>
                    <option value="receiver">Receiver</option>
                    <option value="driver">Driver</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
                {errors.role && <p className="text-red-400 text-xs ml-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.role}</p>}
              </div>

              {formData.role === 'manufacturer' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Manufacturer URN</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-primary transition-colors">
                      <Hash size={18} />
                    </div>
                    <input
                      type="text"
                      className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-background-darker/50 border ${errors.manufacturerUrn ? 'border-red-500' : 'border-gray-300 dark:border-white/10'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all`}
                      name="manufacturerUrn"
                      placeholder="Enter URN"
                      value={formData.manufacturerUrn}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.manufacturerUrn && <p className="text-red-400 text-xs ml-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.manufacturerUrn}</p>}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-primary transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`w-full pl-10 pr-12 py-3 bg-white dark:bg-background-darker/50 border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-white/10'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all`}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs ml-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.password}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-primary transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-background-darker/50 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-white/10'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all`}
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-xs ml-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.confirmPassword}</p>}
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary-gradient py-4 flex items-center justify-center gap-2 group shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all font-bold text-lg rounded-xl mt-6"
            >
              <UserPlus size={20} />
              <span>Create User Account</span>
            </button>
          </form>
        </div>
      </div>
      <LoadingOverlay isVisible={loader} />
    </div>
  );
};

export default CreateUser;
