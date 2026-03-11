import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingPage from '../Loading';

const batchData = {
  BN7890: [
    {
      urn: 'URN123456',
      batchNumber: 'BN7890',
      drugName: 'Paracetamol',
      quantity: 1000,
      manufacturer: 'ABC Pharma',
      endUser: 'John Doe (Receiver)',
      dateOfManufacturing: '2024-11-01',
      expiryDate: '2025-11-01',
      tamperSealNo: 'TS123456789',
      containerId: 'CON123',
      deliveryStatus: 'Shipped',
      lockStatus: 'locked',
    },
    {
      urn: 'URN123457',
      batchNumber: 'BN7890',
      drugName: 'Paracetamol',
      quantity: 500,
      manufacturer: 'ABC Pharma',
      endUser: 'John Doe (Receiver)',
      dateOfManufacturing: '2024-11-01',
      expiryDate: '2025-11-01',
      tamperSealNo: 'TS123456790',
      containerId: 'CON124',
      deliveryStatus: 'Shipped',
      lockStatus: 'unlocked',
    },
  ],
};

const BatchDetail = () => {
  const { batchNumber } = useParams();
  const [batch, setBatch] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setBatch(batchData[batchNumber] || []);
      setLoading(false);
    }, 1500);
  }, [batchNumber]);


  const handleContainerClick = (containerId) => {
    navigate(`/container/${containerId}`);
  };

  if (loading) return <LoadingPage/>;

  return (
    <div className="container-fluid my-5" style={{minHeight: '70vh'}}>
      <div className='text-start'>
        <button className='btn btn-primary my-2' onClick={()=>window.location.href=`/`}><i className='bi bi-arrow-left'></i> Batch page</button>
      </div>
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4>Batch Details</h4>
        </div>
        <div className="card-body">
          {batch.length > 0 ? (
            <>
              <h4 className='text-primary my-3'>Batch Information</h4>
              <p><strong>Batch Number:</strong> {batch[0].batchNumber}</p>
              <p><strong>URN:</strong> {batch[0].urn}</p>
              <p><strong>Manufacturer:</strong> {batch[0].manufacturer}</p>
              <p><strong>Receiver:</strong> {batch[0].endUser}</p>

              <h5 className="mt-4 text-primary my-3">Containers</h5>
              <ul className="list-group">
                {batch.map((item) => (
                  <li
                    key={item.containerId}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    onClick={() => handleContainerClick(item.containerId)}
                    role='button'
                  >
                    <span style={{ cursor: 'pointer' }}>
                      <strong>Container ID:</strong> {item.containerId} - {item.drugName}
                    </span>
                    <button
                      className={`btn btn-${item.lockStatus === 'locked' ? 'success' : 'danger'}`}
                      disabled={item.deliveryStatus === 'Delivered'}
                    >
                      {item.lockStatus === 'locked' ? 'Locked' : 'UnLocked'}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>No data available for this batch.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchDetail;
