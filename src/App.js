import { Route, Routes, Navigate } from 'react-router-dom';
import LoadingPage from './components/pages/Loading';
import Header from './components/blocks/Header';
import Login from './components/pages/Login';
import './css/App.css';
import Footer from './components/blocks/Footer';
import NotFound from './components/pages/Notfound';
import Checkpoint from './components/pages/Checkpoint';
import URNList from './components/pages/URNList'
import BatchList from './components/pages/BatchList';
import BatchDetail from './components/pages/BatchDetail';
import ContainerDetail from './components/pages/ContainerDetail';
import CreateUser from './components/pages/CreateUser';
import UserList from './components/pages/UserList';
import UserDetail from './components/pages/UserDetail';
import DeviceList from './components/pages/DeviceList';
import DeviceDetail from './components/pages/DeviceDetailss';
import { useContext } from 'react';
import { Dcontext } from './context/DataContext';
import AccessDenied from './components/pages/AccessDenied';
import CreateContainer from './components/pages/CreateContainer';
import CreateProduce from './components/pages/CreateProduce';
import ProduceList from './components/pages/ProduceList';
import GeoTracking from './components/pages/GeoTracking';
import GeoTracking2 from './components/pages/GeoTracking2'
import EmailStatus from './components/pages/EmailStatus';

function App() {
  const { isAuth, isLoading, isAdmin, isManufacturer, isCheckpoint1, isCheckpoint2, currentUser } = useContext(Dcontext)

  if (isLoading) {
    return <LoadingPage />;
  }

  const ProtectedRoute = ({ children }) => {
    return isAuth ? children : <Navigate to="/login" />;
  };

  return (
    <div className='min-h-screen bg-[#F4F8F5] dark:bg-background text-gray-800 dark:text-gray-200 flex flex-col font-body selection:bg-[#2E7D32] selection:text-white transition-colors duration-300'>
      <Header />
      <main className='flex-grow container mx-auto px-4 py-8 pt-32 transition-all duration-300'>
        <Routes>
          {/* Default Route to the Dashboard/Shipment List */}
          <Route path='/' element={<ProtectedRoute><BatchList /></ProtectedRoute>} />

          {/* Renamed internal routes conceptually to shipment terms */}
          <Route path='/shipment-list' element={<ProtectedRoute><BatchList /></ProtectedRoute>} />
          <Route path='/shipment/:batchNumber' element={<ProtectedRoute><BatchDetail /></ProtectedRoute>} />
          <Route path='/container/:containerId' element={<ProtectedRoute><ContainerDetail /></ProtectedRoute>} />
          <Route path='/geo' element={<ProtectedRoute><GeoTracking /></ProtectedRoute>} />
          <Route path='/geo2' element={<ProtectedRoute><GeoTracking2 /></ProtectedRoute>} />

          {/* Authentication Route */}
          <Route path='/login' element={!isAuth ? <Login /> : <Navigate to="/" />} />

          {/* Creation Routes */}
          <Route path='/create-shipment' element={<ProtectedRoute><CreateContainer /></ProtectedRoute>} />
          <Route path='/produce' element={<ProtectedRoute><CreateProduce /></ProtectedRoute>} />
          <Route path='/produce-list' element={<ProtectedRoute><ProduceList /></ProtectedRoute>} />

          {/* Checkpoint Routes */}
          <Route path='/checkpoint' element={<ProtectedRoute><Checkpoint /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path='/admin-dashboard' element={<ProtectedRoute><URNList /></ProtectedRoute>} />
          <Route path='/create-user' element={<ProtectedRoute><CreateUser /></ProtectedRoute>} />
          <Route path='/user-list' element={<ProtectedRoute><UserList /></ProtectedRoute>} />
          <Route path='/user/:userId' element={<ProtectedRoute><UserDetail /></ProtectedRoute>} />
          <Route path='/device-list' element={<ProtectedRoute><DeviceList /></ProtectedRoute>} />
          <Route path='/devices/:deviceId' element={<ProtectedRoute><DeviceDetail /></ProtectedRoute>} />
          <Route path='/email-status' element={<ProtectedRoute><EmailStatus /></ProtectedRoute>} />

          <Route path='*' element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      {currentUser !== null && <div className='fixed bottom-4 right-4 bg-white/90 backdrop-blur-md border border-gray-200 p-3 rounded-xl shadow-lg z-50 text-sm'>
        <p className='m-0 flex items-center gap-2'>
          <span className='w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse'></span>
          <span className='font-bold text-[#2E7D32]'>{currentUser.role}:</span>
          <span className='text-gray-600'>{currentUser.username} (Demo Mode)</span>
        </p>
      </div>}
    </div>
  );
}

export default App;
