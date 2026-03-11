import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingPage from './Loading';
import { Factory, MapPin, Search } from 'lucide-react';

const BatchList = () => {
  const [batches, setBatches] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/getAllContainers`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBatches(Array.isArray(data.containers) ? data.containers : []);
        } else {
          alert(data.message);
        }
      })
      .catch(err => {
        console.log('Trouble in connecting to the Server: ', err);
        alert("Trouble in connecting to the Server! Please try again later.");
      });
  }, []);

  const navPage = useNavigate();

  const filteredBatches = batches?.filter(batch =>
    batch.urn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (batches === null) {
    return <LoadingPage />;
  } else {
    return (
      <div className="container mx-auto px-4 min-h-[70vh] animate-fade-in-up">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Manufacturer Registry</h2>
            <p className="text-gray-400">List of registered Manufacturer URNs</p>
          </div>

          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search URN..."
              className="glass-input pl-10 pr-4 py-2 w-full md:w-64 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 text-white placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="glass-card overflow-hidden rounded-2xl border border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="p-4 text-sm font-semibold text-gray-300 w-20">
                    S. No.
                  </th>
                  <th className="p-4 text-sm font-semibold text-gray-300">
                    <div className="flex items-center gap-2">
                      <Factory size={16} className="text-primary-light" />
                      Manufacture URN
                    </div>
                  </th>
                  <th className="p-4 text-sm font-semibold text-gray-300">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-primary-light" />
                      Zonal Region
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredBatches && filteredBatches.length === 0 && (
                  <tr>
                    <td className="p-8 text-center text-gray-500" colSpan={3}>
                      No URNs found matching your search.
                    </td>
                  </tr>
                )}
                {filteredBatches && filteredBatches.map((batch, index) => (
                  <tr
                    key={index}
                    onClick={() => navPage('/batch-list')}
                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <td className="p-4 text-gray-400 font-mono">
                      {index + 1}
                    </td>
                    <td className="p-4 text-white font-medium font-mono group-hover:text-primary-light transition-colors">
                      {batch.urn}
                    </td>
                    <td className="p-4 text-gray-300">
                      South
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
};

export default BatchList;
