import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LoadingPage from './Loading';
import LoadingOverlay from './ResponseWaiting';
import { User, Mail, Phone, Shield, Save, ArrowLeft } from 'lucide-react';

const UserDetail = () => {
  const { userId } = useParams();

  const [fetchedUser, setFetchedUser] = useState(null)
  const [loader, setLoader] = useState(false)
  const [formData, setFormData] = useState({});

  // Update state on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    setLoader(true)
    e.preventDefault();
    console.log('Updated User Data:', formData);

    if (formData.id === Number(userId) && formData.fullname !== '' && formData.username !== '' && formData.email !== '' && formData.contact !== '' && formData.role !== '') {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/update-user`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({ formData })
      })
        .then(res => res.json())
        .then(data => {
          setLoader(false)
          if (data.success) {
            alert(data.message)
            window.location.href = "/user-list"
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
    else {
      setLoader(false)
      alert('Please provide all details!');
    }
  };


  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/fetch-user`, {
      method: 'POST',
      headers: {
        "Content-type": "application/json"
      },
      credentials: 'include',
      body: JSON.stringify({ userId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFetchedUser(data.User)
          setFormData(data.User)
        }
        else {
          alert(data.message)
        }
      })
      .catch(err => {
        console.log('Trouble in connecting to the Server: ', err)
        // alert("Trouble in connecting to the Server! Please try again later.")
      })
  }, [userId])

  if (fetchedUser === null) {
    return <LoadingPage />;
  }
  else {
    return (
      <div className="container mx-auto px-4 py-8 animate-fade-in-up min-h-[80vh]">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => window.location.href = '/user-list'}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Users</span>
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/20 text-primary-light mb-4 ring-1 ring-primary/50 shadow-lg shadow-primary/20">
              <User size={40} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Edit User Profile</h1>
            <p className="text-gray-400">Update account details and permissions.</p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="bg-background-darker/50 rounded-xl p-4 border border-white/5 mb-6">
                <label className="text-xs text-gray-500 uppercase tracking-widest font-semibold ml-1">System ID</label>
                <div className="text-lg font-mono text-gray-300 ml-1">#{formData.id}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      name="fullname"
                      className="w-full pl-10 pr-4 py-3 bg-background-darker/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-gray-500 transition-all"
                      value={formData.fullname || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Username</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      name="username"
                      className="w-full pl-10 pr-4 py-3 bg-background-darker/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-gray-500 transition-all"
                      value={formData.username || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Contact Number</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                      <Phone size={18} />
                    </div>
                    <input
                      type="text"
                      name="contact"
                      className="w-full pl-10 pr-4 py-3 bg-background-darker/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-gray-500 transition-all"
                      value={formData.contact || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      className="w-full pl-10 pr-4 py-3 bg-background-darker/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-gray-500 transition-all"
                      value={formData.email || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Role</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                    <Shield size={18} />
                  </div>
                  <select
                    name="role"
                    className="w-full pl-10 pr-4 py-3 bg-background-darker/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white transition-all appearance-none"
                    value={formData.role || ''}
                    onChange={handleChange}
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="manufacturer">Manufacturer</option>
                    <option value="receiver">Receiver</option>
                    <option value="checkpoint1">Checkpoint 1</option>
                    <option value="checkpoint2">Checkpoint 2</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {formData.role === 'manufacturer' && (
                <div className="space-y-2 animate-fade-in">
                  <label className="text-sm font-medium text-gray-300 ml-1">Manufacturer URN</label>
                  <input
                    type="text"
                    name="manufacturerUrn"
                    className="w-full px-4 py-3 bg-background-darker/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-gray-500 transition-all"
                    value={formData.urn || ''}
                    onChange={handleChange}
                    placeholder="Enter URN"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Change Password (Optional)</label>
                <input
                  type="password"
                  name="password"
                  className="w-full px-4 py-3 bg-background-darker/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-gray-500 transition-all"
                  placeholder="Enter new password to change"
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary-gradient py-4 flex items-center justify-center gap-2 group shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all font-bold text-lg rounded-xl mt-8"
              >
                <Save size={20} />
                <span>Save Changes</span>
              </button>
            </form>
          </div>
        </div>
        <LoadingOverlay isVisible={loader} />
      </div>
    );
  }
};

export default UserDetail;
