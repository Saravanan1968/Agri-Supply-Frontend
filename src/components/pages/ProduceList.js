import React, { useEffect, useState } from "react";
import { Clock, Database, Hash, Loader2, Leaf } from 'lucide-react';

const ProduceList = () => {
  const [produceData, setProduceData] = useState(null); // null = loading

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/get-all-produce`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          const mapped = data.data.map(record => {
            const consolidated = {};
            const names = record.produceNames || [];
            const quantities = record.produceQuantities || [];

            names.forEach((name, i) => {
              const trimmedName = name.trim();
              consolidated[trimmedName] = (consolidated[trimmedName] || 0) + quantities[i];
            });

            return {
              urn: record.urn,
              updatedAt: record.updatedAt,
              produceNames: Object.keys(consolidated),
              produceQuantities: Object.values(consolidated),
              totalQuantity: Object.values(consolidated).reduce((a, b) => a + b, 0)
            };
          });
          setProduceData(mapped);
        } else {
          setProduceData([]);
        }
      })
      .catch(() => setProduceData([]));
  }, []);

  if (produceData === null) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 size={36} className="animate-spin text-[#4CAF50]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in-up min-h-[70vh]">
      <div className="mb-8 flex items-center justify-between shadow-sm bg-white dark:bg-background-lighter p-6 rounded-2xl border border-green-100 dark:border-white/10 transition-colors">
        <div>
          <h2 className="text-3xl font-bold text-[#2E7D32] dark:text-[#4CAF50] mb-2 font-sans transition-colors">Latest Inventory Records</h2>
          <p className="text-gray-600 dark:text-gray-400 font-medium transition-colors">Ledger history of agricultural produce stock updates.</p>
        </div>
        <div className="hidden md:block p-4 rounded-full bg-green-50 dark:bg-[#2E7D32]/10 text-[#2E7D32] dark:text-[#4CAF50] transition-colors">
          <Database size={28} />
        </div>
      </div>

      <div className="grid gap-6">
        {produceData.length === 0 ? (
          <div className="text-center p-12 bg-white dark:bg-background-lighter rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm transition-colors">
            <Leaf size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 transition-colors">No Inventory Records Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-2 transition-colors">
              No produce inventory has been submitted by any manufacturer yet.<br />
              Manufacturers can update inventory from the <strong>Produce</strong> page.
            </p>
          </div>
        ) : (
          produceData.map((record) => (
            <div className="bg-white dark:bg-background-lighter p-6 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md hover:border-[#4CAF50]/30 transition-all group" key={record.urn}>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-grow">
                  <div className="flex flex-wrap items-center gap-4 mb-5">
                    <div className="px-4 py-1.5 rounded-full bg-green-50 dark:bg-[#2E7D32]/10 border border-green-100 dark:border-[#2E7D32]/30 text-[#2E7D32] dark:text-[#4CAF50] font-mono text-sm font-semibold flex items-center gap-2 transition-colors">
                      <Hash size={14} />
                      <span>Supplier URN: {record.urn}</span>
                    </div>
                    {record.updatedAt && (
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium transition-colors">
                        <Clock size={16} />
                        <span>{new Date(record.updatedAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-white/10 transition-colors">
                    <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
                      <thead className="text-xs text-gray-600 dark:text-gray-400 uppercase bg-gray-50 dark:bg-background-darker font-bold border-b border-gray-100 dark:border-white/10 transition-colors">
                        <tr>
                          <th className="px-5 py-4">Agricultural Produce</th>
                          <th className="px-5 py-4 text-right">Quantity (kg/L)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-white/10 bg-white dark:bg-background">
                        {record.produceNames.map((name, index) => (
                          <tr key={index} className="hover:bg-green-50/30 dark:hover:bg-white/5 transition-colors">
                            <td className="px-5 py-4 font-semibold text-gray-800 dark:text-gray-200 transition-colors">{name}</td>
                            <td className="px-5 py-4 text-right font-mono font-bold text-[#2E7D32] dark:text-[#4CAF50] bg-green-50/50 dark:bg-[#2E7D32]/10 transition-colors">{record.produceQuantities[index]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="md:w-56 flex-shrink-0 flex flex-col justify-center items-center bg-gray-50 dark:bg-background-darker/50 rounded-2xl p-6 border border-gray-100 dark:border-white/5 transition-colors">
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 transition-colors">Total Volume</p>
                  <h4 className="text-4xl font-black text-[#2E7D32] dark:text-[#4CAF50] font-mono transition-colors">{record.totalQuantity}</h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium transition-colors">Units</p>
                  <div className="w-full h-1.5 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] mt-4 rounded-full opacity-80"></div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProduceList;
