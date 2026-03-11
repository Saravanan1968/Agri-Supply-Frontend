import React, { useState, useEffect, useContext } from "react";
import LoadingPage from "./Loading";
import { Dcontext } from "../../context/DataContext";

const CreateContainer = () => {
  const [fetchedDevices, setFetchedDevices] = useState(null);
  const { currentUser } = useContext(Dcontext);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/fetch-devices`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFetchedDevices(data.deviceData);
        } else {
          setFetchedDevices([]);
        }
        console.log("fetched devices: ", data.deviceData);
      })
      .catch((err) => {
        setFetchedDevices([]);
        console.log("Trouble in connecting to the Server: ", err);
        alert("Trouble in connecting to the Server! Please try again later.");
      });
  }, []);

  // Ensure state doesn't crash if currentUser is null initially
  const [urn, setUrn] = useState("");

  useEffect(() => {
    if (currentUser && currentUser.urn) {
      setUrn(currentUser.urn);
    }
  }, [currentUser]);

  const [endUser, setEndUser] = useState("");
  const [containers, setContainers] = useState([]);
  const [newContainer, setNewContainer] = useState({
    containerId: "",
    tamperSealNo: "",
    produceName: "",
    quantity: "",
    manufacturingDate: "",
    expiryDate: "",
  });
  const [errors, setErrors] = useState({});

  const handleCommonFieldChange = (e) => {
    const { name, value } = e.target;
    setErrors({ ...errors, [name]: "" }); // Clear error for the field
    if (name === "urn") setUrn(value);
    if (name === "endUser") setEndUser(value);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setErrors({ ...errors, [name]: "" }); // Clear error for the field
    setNewContainer({ ...newContainer, [name]: value });
  };

  const validateContainer = (container) => {
    const { containerId, tamperSealNo, produceName, quantity, manufacturingDate, expiryDate } = container;
    const fieldErrors = {};

    if (!containerId) fieldErrors.containerId = "Container ID is required!";
    if (!tamperSealNo) fieldErrors.tamperSealNo = "Tamper Seal Number is required!";
    if (!produceName) fieldErrors.produceName = "produce Name is required!";
    if (!quantity || quantity <= 0) fieldErrors.quantity = "Quantity must be greater than zero!";
    if (!manufacturingDate) fieldErrors.manufacturingDate = "Manufacturing Date is required!";
    if (!expiryDate) fieldErrors.expiryDate = "Expiry Date is required!";
    if (new Date(manufacturingDate) > new Date(expiryDate))
      fieldErrors.manufacturingDate = "Manufacturing date cannot be after expiry date!";

    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };

  const validateCommonFields = () => {
    const fieldErrors = {};
    if (!urn) fieldErrors.urn = "URN is required!";
    if (!endUser) fieldErrors.endUser = "End User is required!";
    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };

  const validateAllFields = () => {
    const fieldErrors = {};
    if (!urn) fieldErrors.urn = "URN is required!";
    if (!endUser) fieldErrors.endUser = "End User is required!";
    validateContainer(newContainer);
    return Object.keys({ ...fieldErrors, ...errors }).length === 0;
  };

  const addContainer = () => {
    if (validateContainer(newContainer)) {
      setContainers([...containers, newContainer]);
      setNewContainer({
        containerId: "",
        tamperSealNo: "",
        produceName: "",
        quantity: "",
        manufacturingDate: "",
        expiryDate: "",
      });
    }
  };

  const deleteContainer = (index) => {
    const updatedContainers = containers.filter((_, i) => i !== index);
    setContainers(updatedContainers);
  };

  const createBatch = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/enroll-container`, {
      // fetch(`${process.env.REACT_APP_BACKEND_URL}/create-batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ urn, endUser, containers }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        if (data.success) {
          setUrn(""); // Reset urn after batch creation
          setEndUser("");
          setContainers([]);
        }
      })
      .catch((err) => {
        console.log("Trouble in connecting to the Server: ", err);
        alert("Trouble in connecting to the Server! Please try again later.");
      });
  };

  const handleBatchCreation = () => {
    if (containers.length > 0) {
      if (validateCommonFields()) {
        createBatch();
      } else {
        alert("Please provide the Batch Informations!");
      }
    } else if (validateAllFields()) {
      createBatch();
    }
  };

  console.log("containers: ", containers, urn, endUser);

  if (fetchedDevices === null) {
    return <LoadingPage />;
  } else {
    // Helper to safely render devices whether fetching returned an array or object
    const renderDeviceOptions = () => {
      if (Array.isArray(fetchedDevices)) {
        return fetchedDevices.map((device, idx) => (
          <option key={idx} value={device.id}>
            {device.id} - {device.name}
          </option>
        ));
      } else if (fetchedDevices && fetchedDevices.id) {
        return (
          <option value={fetchedDevices.id}>
            {fetchedDevices.id} - {fetchedDevices.name}
          </option>
        );
      }
      return null;
    };

    return (
      <div className="container my-5">
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h4>Create Batch - Add Containers</h4>
          </div>
          <div className="card-body">
            {/* URN Input */}
            <div className="form-group">
              <label htmlFor="urn">URN</label>
              <input
                type="text"
                className={`form-control ${errors.urn ? "is-invalid" : ""}`}
                id="urn"
                name="urn"
                value={urn}
                onChange={handleCommonFieldChange}
                placeholder="Enter Unique Reference Number"
              />
              {errors.urn && <div className="invalid-feedback">{errors.urn}</div>}
            </div>

            {/* End User Input */}
            <div className="form-group">
              <label htmlFor="endUser">Receiver/ End User</label>
              <input
                type="text"
                className={`form-control ${errors.endUser ? "is-invalid" : ""}`}
                id="endUser"
                name="endUser"
                value={endUser}
                onChange={handleCommonFieldChange}
                placeholder="Enter End User Name or ID"
              />
              {errors.endUser && <div className="invalid-feedback">{errors.endUser}</div>}
            </div>

            <hr />

            <div className="form-group">
              <label htmlFor="containerId">Container Device ID</label>
              <select
                className={`form-control ${errors.containerId ? "is-invalid" : ""}`}
                id="containerId"
                name="containerId"
                value={newContainer.containerId}
                onChange={handleFieldChange}
              >
                <option value="" disabled>Select Container ID</option>
                {renderDeviceOptions()}
              </select>
              {errors.containerId && <div className="invalid-feedback">{errors.containerId}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="tamperSealNo">Tamper Seal Number</label>
              <input
                type="text"
                className={`form-control ${errors.tamperSealNo ? "is-invalid" : ""}`}
                id="tamperSealNo"
                name="tamperSealNo"
                value={newContainer.tamperSealNo}
                onChange={handleFieldChange}
              />
              {errors.tamperSealNo && <div className="invalid-feedback">{errors.tamperSealNo}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="produceName">produce Name</label>
              <input
                type="text"
                className={`form-control ${errors.produceName ? "is-invalid" : ""}`}
                id="produceName"
                name="produceName"
                value={newContainer.produceName}
                onChange={handleFieldChange}
              />
              {errors.produceName && <div className="invalid-feedback">{errors.produceName}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                className={`form-control ${errors.quantity ? "is-invalid" : ""}`}
                id="quantity"
                name="quantity"
                value={newContainer.quantity}
                onChange={handleFieldChange}
              />
              {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="manufacturingDate">Manufacturing Date</label>
              <input
                type="date"
                className={`form-control ${errors.manufacturingDate ? "is-invalid" : ""}`}
                id="manufacturingDate"
                name="manufacturingDate"
                value={newContainer.manufacturingDate}
                onChange={handleFieldChange}
              />
              {errors.manufacturingDate && <div className="invalid-feedback">{errors.manufacturingDate}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date</label>
              <input
                type="date"
                className={`form-control ${errors.expiryDate ? "is-invalid" : ""}`}
                id="expiryDate"
                name="expiryDate"
                value={newContainer.expiryDate}
                onChange={handleFieldChange}
              />
              {errors.expiryDate && <div className="invalid-feedback">{errors.expiryDate}</div>}
            </div>

            {/* Add Container Button */}
            <button type="button" className="btn btn-primary my-2" onClick={addContainer}>
              Add Container
            </button>

            <hr />
            {/* Display Added Containers */}
            <div>
              <h5>Added Containers</h5>
              <ul className="list-group">
                {containers.map((container, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between">
                    {container.containerId} - {container.tamperSealNo} - {container.produceName}
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteContainer(index)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Submit Batch Button */}
            <button
              type="button"
              className="btn btn-success mt-4"
              onClick={handleBatchCreation}
            >
              Create Batch
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default CreateContainer;
