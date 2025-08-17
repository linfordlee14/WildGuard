import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapView from '../components/MapView';
import PredictionTable from '../components/PredictionTable';
import api from '../services/api';

function Dashboard() {
  const [predictions, setPredictions] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

useEffect(() => {
  const fetchData = async () => {
    try {
      const predResponse = await api.get('/predict');
      setPredictions(predResponse.data.locations);
      
      const hotResponse = await api.get('/hotspots');
      setHotspots(hotResponse.data.hotspots);
      
      setLoading(false);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };
  fetchData();
}, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">WildGuard Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Poaching Risk Map</h2>
          <MapView hotspots={hotspots} />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Risk Predictions</h2>
          <PredictionTable predictions={predictions} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Poaching Prevention Education</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>African elephants have declined by 60% in the last decade, with approximately 35,000 elephants killed annually for their ivory tusks.</li>
          <li>Community-based conservation programs that provide alternative livelihoods to local populations have reduced poaching incidents by up to 70% in protected areas.</li>
          <li>Advanced technologies like thermal imaging drones and AI-powered camera traps help rangers detect poachers 3x faster than traditional patrol methods.</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;