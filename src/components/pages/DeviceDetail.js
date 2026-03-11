// DeviceDetail.js
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DeviceDetail = () => {
  const { deviceId } = useParams();
  const navpage = useNavigate();

  const deviceDetails = {
    D001: {
      LDR: '1234',
      ForceSensor: 'Active',
      Vibration: 'Low',
      Temperature: '22°C',
      Humidity: '50%',
      Latitude: '28.7041° N',
      Longitude: '77.1025° E',
      LockStatus: 'Unlocked',
      RecentlyUsed: '2024-12-01',
      batches: [
        { batchNumber: 'BN7890', name: 'Paracetamol', containerId: 'CON123', status: 'Shipped' },
        { batchNumber: 'BN7891', name: 'Aspirin', containerId: 'CON124', status: 'Shipped' },
      ],
    },
    D002: {
      LDR: '5678',
      ForceSensor: 'Inactive',
      Vibration: 'High',
      Temperature: '25°C',
      Humidity: '60%',
      Latitude: '28.6139° N',
      Longitude: '77.2090° E',
      LockStatus: 'Locked',
      RecentlyUsed: '2024-12-02',
      batches: [
        { batchNumber: 'BN7890', name: 'Paracetamol', containerId: 'CON123', status: 'Shipped' },
        { batchNumber: 'BN7891', name: 'Aspirin', containerId: 'CON124', status: 'Shipped' },
      ],
    },
    D003: {
      LDR: '9876',
      ForceSensor: 'Active',
      Vibration: 'Moderate',
      Temperature: '20°C',
      Humidity: '55%',
      Latitude: '28.7041° N',
      Longitude: '77.1025° E',
      LockStatus: 'Unlocked',
      RecentlyUsed: '2024-12-03',
      batches: [
        { batchNumber: 'BN7890', name: 'Paracetamol', containerId: 'CON123', status: 'Shipped' },
        { batchNumber: 'BN7891', name: 'Aspirin', containerId: 'CON124', status: 'Shipped' },
      ],
    },
  };

  const handleBatchClick = (batchNumber) => {
    navpage(`/batch/${batchNumber}`);
  };

  const device = deviceDetails[deviceId];

  if (!device) {
    return <div>Device not found</div>;
  }

  return (
    <div>
      <h3>Device {deviceId} Details</h3>
      <p>LDR: {device.LDR}</p>
      <p>Force Sensor: {device.ForceSensor}</p>
      <p>Vibration: {device.Vibration}</p>
      <p>Temperature: {device.Temperature}</p>
      <p>Humidity: {device.Humidity}</p>
      <p>Latitude: {device.Latitude}</p>
      <p>Longitude: {device.Longitude}</p>
      <p>Lock Status: {device.LockStatus}</p>
      <p>Recently Used: {device.RecentlyUsed}</p>

      <h4>Batches</h4>
      <ul>
        {device.batches.map((batch) => (
          <li key={batch.batchNumber} onClick={() => handleBatchClick(batch.batchNumber)}>
            {batch.batchNumber} {batch.name} {batch.containerId} {batch.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeviceDetail;
