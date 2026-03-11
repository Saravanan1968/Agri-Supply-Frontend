import React, { useContext, useEffect, useState } from "react";
import { Dcontext } from "../../context/DataContext";
import LoadingPage from "./Loading";
import LoadingOverlay from "./ResponseWaiting";
import { Save, Pill, Activity, AlertCircle, CheckCircle } from 'lucide-react';

const CreateProduceData = () => {
  const { currentUser, isManufacturer } = useContext(Dcontext);

  const [urn, setUrn] = useState("");
  const [produceList, setProduceList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loader, setLoader] = useState(false)

  const [produceInfo, setProduceInfo] = useState(null);

  useEffect(() => {
    if (currentUser !== null) {
      setUrn(currentUser.urn);
    }
  }, [currentUser]);

  useEffect(() => {
    if (produceInfo !== null) {
      if (produceInfo[0] !== "" || produceInfo[1].length !== 0 || produceInfo[2].length !== 0) {
        if (produceInfo[1].length === produceInfo[2].length) {
          setProduceList((prev) => {
            let tempArr = [...prev];
            produceInfo[1].forEach((data, i) => {
              tempArr.push({
                produceName: data,
                existingQuantity: produceInfo[2][i],
                addedQuantity: 0,
              });
            });
            return tempArr;
          });
        }
      }
    }
  }, [produceInfo]);

  useEffect(() => {
    if (urn !== "") {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/getProduceDataByURN`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ urn }),
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            if (data.data.length !== 0) {
              setProduceInfo(data.data);
            } else {
              setErrorMessage(data.message);
            }
          } else {
            setErrorMessage(data.message);
          }
        })
        .catch((err) => {
          console.log("Trouble in connecting to the Server: ", err);
          // alert("Trouble in connecting to the Server! Please try again later.");
        });
    }
  }, [urn]);

  const produceOptions = [
    "Produce - Organic Tomatoes",
    "Produce - Fresh Apples",
    "Produce - Wheat Grains",
    "Produce - Corn/Maize",
    "Dairy - Fresh Milk",
    "AgriSupply - Organic Fertilizer",
    "AgriSupply - Seed Packets",
  ];

  const handleQuantityChange = (produceName, value) => {
    setProduceList((prevList) => {
      const updatedList = [...prevList];
      const existingIndex = updatedList.findIndex((item) => item.produceName === produceName);

      if (existingIndex !== -1) {
        // Update existing item by matching name
        updatedList[existingIndex] = {
          ...updatedList[existingIndex],
          addedQuantity: value ? parseInt(value) : 0,
        };
      } else {
        // Add a new item if it doesn't exist in the list yet
        updatedList.push({
          produceName: produceName,
          existingQuantity: 0,
          addedQuantity: value ? parseInt(value) : 0,
        });
      }
      return updatedList;
    });
  };


  const handleSubmit = async (e) => {
    setLoader(true)
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!urn || produceList.length === 0) {
      setErrorMessage("Please provide a URN and add at least one produce.");
      setLoader(false)
      return;
    }

    const produceNames = [];
    const produceQuantities = [];

    produceList.forEach((produce) => {
      const totalQuantity = Number(produce.existingQuantity) + produce.addedQuantity;
      if (totalQuantity > 0) {
        produceNames.push(produce.produceName);
        produceQuantities.push(totalQuantity);
      }
    });

    if (produceNames.length === 0) {
      setErrorMessage("Please update the quantity for at least one chemical/produce.");
      setLoader(false)
      return;
    }

    fetch(`${process.env.REACT_APP_BACKEND_URL}/createProduceData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        urn,
        produceNames,
        produceQuantities,
      }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setLoader(false)
        if (data.success) {
          setSuccessMessage("Produce inventory updated successfully!");
          alert(data.message);
          setUrn("");
          setProduceList([]);
          window.location.href = "/";
        } else {
          setErrorMessage(data.message);
          alert(data.message);
        }
      })
      .catch((err) => {
        setLoader(false)
        console.log("Trouble in connecting to the Server: ", err);
        alert("Trouble in connecting to the Server! Please try again later.");
      });
  };

  if (isManufacturer === null) {
    return <LoadingPage />;
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in-up min-h-[80vh]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/20 text-[#2E7D32] dark:text-[#4CAF50] mb-4 ring-1 ring-[#2E7D32]/50 dark:ring-[#4CAF50]/50 transition-colors">
            <Pill size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 transition-colors">Manage Agri Supply Inventory</h1>
          <p className="text-gray-600 dark:text-gray-400 transition-colors">Update stock levels for your farm's produce and agricultural products.</p>
        </div>

        <div className="bg-white dark:bg-background-lighter p-8 rounded-3xl border border-green-100 dark:border-white/10 shadow-lg relative overflow-hidden transition-colors">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400">
              <AlertCircle size={20} />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 text-green-400">
              <CheckCircle size={20} />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="space-y-2">
              <label htmlFor="urn" className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1 transition-colors">
                Farmer/Manufacturer URN
              </label>
              <input
                type="text"
                id="urn"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-background-darker/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/50 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all font-mono shadow-inner"
                placeholder="Enter URN"
                value={urn}
                onChange={(e) => setUrn(e.target.value)}
                readOnly
                required
              />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 transition-colors">
                <Activity size={20} className="text-[#2E7D32] dark:text-[#4CAF50]" />
                Inventory List
              </h3>

              <div className="bg-gray-50 dark:bg-background-darker/30 rounded-2xl p-4 border border-gray-200 dark:border-white/5 transition-colors">
                {/* Header Row (Desktop) */}
                <div className="hidden md:flex items-center gap-4 mb-3 pb-2 border-b border-gray-200 dark:border-white/5 text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors">
                  <div className="flex-grow pl-2">Produce Name</div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 text-center">Current</div>
                    <div className="w-4"></div>
                    <div className="w-24 text-center">Add</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {produceOptions.map((produce, index) => {
                    const existingProduce = produceList.find((item) => item.produceName === produce);
                    const existingQuantity = existingProduce ? existingProduce.existingQuantity : 0;

                    return (
                      <div key={index} className="flex flex-col md:flex-row items-center gap-4 p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:bg-green-50 dark:hover:bg-white/10 transition-colors group shadow-sm">
                        <div className="flex-grow w-full md:w-auto">
                          <label htmlFor={produce} className="text-gray-700 dark:text-gray-200 font-medium cursor-pointer transition-colors block md:inline pl-2">
                            {produce}
                          </label>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                          {/* Mobile Label for Current */}
                          <span className="md:hidden text-sm text-gray-500">Current:</span>

                          <div className="w-24 px-3 py-2 bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-gray-600 dark:text-gray-400 text-center font-mono text-sm shadow-inner transition-colors">
                            {existingQuantity}
                          </div>

                          <span className="text-gray-500 font-bold">+</span>

                          <div className="flex items-center gap-2">
                            {/* Mobile Label for Add */}
                            <span className="md:hidden text-sm text-gray-500">Add:</span>
                            <input
                              type="number"
                              className="w-24 px-3 py-2 bg-background-darker border border-white/10 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-center placeholder-gray-600"
                              placeholder="0"
                              min="0"
                              onChange={(e) => handleQuantityChange(produce, e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary-gradient py-4 flex items-center justify-center gap-2 group shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all font-bold text-lg rounded-xl"
            >
              <Save size={20} />
              <span>Update Inventory</span>
            </button>
          </form>
        </div>
      </div>
      <LoadingOverlay isVisible={loader} />
    </div>
  );
};

export default CreateProduceData;
