import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ResultCard from '../components/ResultCard';

export default function Home() {
  const [hallTicket, setHallTicket] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!hallTicket.trim()) {
      setError('Please enter a hall ticket number');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`/api/results?hallTicket=${encodeURIComponent(hallTicket.trim())}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch results');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto mb-8"
        >
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            BS-MS AUTONOMOUS 2024-2025
          </h1>
          
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <label htmlFor="hallTicket" className="block text-sm font-medium text-gray-700 mb-2">
                Hall Ticket Number
              </label>
              <input
                id="hallTicket"
                type="text"
                value={hallTicket}
                onChange={(e) => setHallTicket(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your hall ticket number"
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'View Results'}
            </button>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-sm text-red-600 text-center"
              >
                {error}
              </motion.p>
            )}
          </form>
        </motion.div>

        {(loading || result) && (
          <ResultCard result={result} loading={loading} />
        )}
      </div>
    </div>
  );
}