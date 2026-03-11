import React, { useState } from 'react';

const ReceiverBatchPage = () => {
  // Dummy batch data for the receiver (replace this with actual data from the backend)
  const batchData = {
    urn: 'URN123456',
    batchNumber: 'BN7890',
    produceName: 'Paracetamol',
    quantity: 1000,
    manufacturer: 'ABC Pharma',
    endUser: 'John Doe (Receiver)',
    dateOfManufacturing: '2024-11-01',
    expiryDate: '2025-11-01',
    tamperSealNo: 'TS123456789',
    deliveryStatus: 'Shipped', // Initial status
  };

  // State for tracking delivery status update
  const [deliveryStatus, setDeliveryStatus] = useState(batchData.deliveryStatus);
  const [statusMessage, setStatusMessage] = useState(');

  // Function to handle delivery status update
  const handleUpdateStatus = () => {
    // Simple validation: only allow status update if the batch is shipped
    if (deliveryStatus !== 'Shipped`) {
      setStatusMessage('Batch is not in shipped status. Cannot update delivery status.`);
      return;
    }

    // Update delivery status to "Delivered"
    setDeliveryStatus('Delivered`);
    setStatusMessage('Batch marked as delivered.`);
  };

  return (
    <div className="container my-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4>Batch Details - Receiver</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h5>Batch Information</h5>
              <ul className="list-group">
                <li className="list-group-item"><strong>URN:</strong> {batchData.urn}</li>
                <li className="list-group-item"><strong>Batch Number:</strong> {batchData.batchNumber}</li>
                <li className="list-group-item"><strong>produce Name:</strong> {batchData.produceName}</li>
                <li className="list-group-item"><strong>Quantity:</strong> {batchData.quantity}</li>
                <li className="list-group-item"><strong>Manufacturer:</strong> {batchData.manufacturer}</li>
                <li className="list-group-item"><strong>End User:</strong> {batchData.endUser}</li>
                <li className="list-group-item"><strong>Date of Manufacturing:</strong> {batchData.dateOfManufacturing}</li>
                <li className="list-group-item"><strong>Expiry Date:</strong> {batchData.expiryDate}</li>
                <li className="list-group-item"><strong>Tamper Seal No:</strong> {batchData.tamperSealNo}</li>
                <li className="list-group-item"><strong>Delivery Status:</strong> {deliveryStatus}</li>
              </ul>
            </div>
          </div>

          {/* Status Update Section */}
          {deliveryStatus === 'Shipped' && (
            <div className="mt-4">
              <button className="btn btn-success" onClick={handleUpdateStatus}>Mark as Delivered</button>
            </div>
          )}

          {/* Status Message */}
          {statusMessage && (
            <div className="mt-3 alert alert-info">
              {statusMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiverBatchPage;
