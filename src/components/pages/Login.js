import React, { useState } from "react";
import LoadingOverlay from "./ResponseWaiting";
import { User, Lock, ArrowRight, CheckCircle } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loader, setLoader] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!username) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    setLoader(true);
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => {
          setLoader(false);
          if (data.success) {
            window.location.href = "/";
          } else {
            alert(data.message);
          }
        })
        .catch(err => {
          setLoader(false);
          console.log('Trouble in connecting to the Server: ', err);
          alert("Trouble in connecting to the Server! Please try again later.");
        });
    } else {
      setLoader(false);
      setErrors(formErrors);
    }
  };

  // FeatureCard removed as it's unused


  return (
    <div className="flex flex-col gap-20 pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        {/* Abstract Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary-light backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Next Gen SCM Platform
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Secure <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-light via-secondary to-primary-light bg-[length:200%_auto] animate-gradient">
                Agriculture Supply Chain
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
              Track agricultural produce from origin to consumer with uncompromised transparency, security, and real-time analytics powered by Blockchain.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="text-primary-light" size={20} />
                <span>Real-time Tracking</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="text-primary-light" size={20} />
                <span>Anti-counterfeit</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="text-primary-light" size={20} />
                <span>Smart Contracts</span>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="w-full max-w-md mx-auto lg:mr-0 animate-fade-in-up delay-100">
            <div className="glass-card p-8 sm:p-10 relative overflow-hidden transform hover:scale-[1.01] transition-transform duration-500">
              <div className="relative z-10">
                <div className="text-center mb-10">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Sign in to access your dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Username</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-primary transition-colors">
                        <User size={18} />
                      </div>
                      <input
                        type="text"
                        className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-background-darker/50 border ${errors.username ? 'border-red-500' : 'border-gray-300 dark:border-white/10'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all`}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                      />
                    </div>
                    {errors.username && <p className="text-red-400 text-xs ml-1">{errors.username}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-primary transition-colors">
                        <Lock size={18} />
                      </div>
                      <input
                        type="password"
                        className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-background-darker/50 border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-white/10'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                      />
                    </div>
                    {errors.password && <p className="text-red-400 text-xs ml-1">{errors.password}</p>}
                  </div>

                  <button type="submit" className="w-full btn-primary-gradient py-3 flex items-center justify-center gap-2 group mt-4">
                    <span>Login to Dashboard</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>


      <LoadingOverlay isVisible={loader} />
    </div>
  );
};

export default LoginPage;
