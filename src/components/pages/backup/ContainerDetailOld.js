import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Dcontext } from '../../../context/DataContext';
import LoadingPage from '../Loading';

const containerData = {
  CON123: {
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
  CON124: {
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
};

const ContainerDetail = () => {

  
  const {isAuth, isAdmin, isManufacturer, isReceiver, isCheckpoint1, isCheckpoint2} = useContext(Dcontext)

  const { containerId } = useParams();
  const [container, setContainer] = useState(null);

  useEffect(() => {
    setContainer(containerData[containerId] || null);
  }, [containerId]);

  const handleUpdateStatus = (batchNumber) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/update-status`, {
      method: 'POST',
      headers: {
        "Content-type": "application/json"
      },
      credentials: 'include',
      body: JSON.stringify({containerId: containerId})
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.success){
            alert(data.message)
            window.location.href=`/batch/x${batchNumber}`
        }
        else{
            alert(data.message)
        }
    })
    .catch(err=>{
        console.log('Trouble in connecting to the Server: ',err)
        alert("Trouble in connecting to the Server! Please try again later.")
    })
  };

  // if (!container||isAuth===null) return <LoadingPage/>;

  return (
    <div className="container-fluid my-5">
      <div className='text-start'>
        <button className='btn btn-primary my-2' onClick={()=>window.location.href=`/batch/${container.batchNumber}`}><i className='bi bi-arrow-left'></i> Batch page</button>
      </div>
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4>Container Details</h4>
        </div>
        <div className="card-body">
            <p><strong>Batch Number:</strong> {container.batchNumber}</p>
            <p><strong>URN:</strong> {container.urn}</p>
            <p><strong>Manufacturer:</strong> {container.manufacturer}</p>
            <p><strong>Receiver:</strong> {container.endUser}</p>
            <p><strong>Container ID:</strong> {container.containerId}</p>
            <p><strong>Drug Name:</strong> {container.drugName}</p>
            <p><strong>Quantity:</strong> {container.quantity}</p>
            <p><strong>Date of Manufacturing:</strong> {container.dateOfManufacturing}</p>
            <p><strong>Expiry Date:</strong> {container.expiryDate}</p>
            <p><strong>Tamper Seal No:</strong> {container.tamperSealNo}</p>
            <p><strong>Delivery Status:</strong> {container.deliveryStatus}</p>
            <p className={`${container.lockStatus==='locked'?'text-success':'text-danger'} fw-bold`}><strong className='text-dark'>Lock Status:</strong> {container.lockStatus}</p>
            { (isAdmin===false)&&<button
              className={`btn btn-${container.deliveryStatus === 'Delivered' ? 'secondary' : 'primary'}`}
              onClick={()=>handleUpdateStatus(container.batchNumber)}
              disabled={isAdmin===true}
            >
              {(isManufacturer===true)&&((container.deliveryStatus==='Shipped`) ? container.deliveryStatus : 'Mark as Shipped`)}
              {(isCheckpoint1===true)&&((container.deliveryStatus==='Crossed Checkpoint 1`) ? container.deliveryStatus : 'Mark Checkpoint 1`)}
              {(isCheckpoint2===true)&&((container.deliveryStatus==='Crossed Checkpoint 2`) ? container.deliveryStatus : 'Mark Checkpoint 2`)}
              {(isReceiver===true)&&((container.deliveryStatus==='Delivered`) ? container.deliveryStatus : 'Mark as Delivered`)}
            </button>}
        </div>
      </div>
    </div>
  );
};

export default ContainerDetail;
