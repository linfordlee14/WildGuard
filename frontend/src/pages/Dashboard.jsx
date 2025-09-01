import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MapView from '../components/MapView';
import PredictionTable from '../components/PredictionTable';
import { getPredictions, getHotspots, uploadCsv } from '../services/api';
import CsvUploader from '../components/CsvUploader';
import EducationalContent from '../components/EducationalContent';

const Toast = ({ message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const baseStyle = 'fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white';
  const typeStyle = type === 'success' ? 'bg-wg-forest' : 'bg-red-500';

  return (
    <div className={`${baseStyle} ${typeStyle}`} role="alert" aria-live="assertive">
      {message}
    </div>
  );
};

function Dashboard() {
  const [predictions, setPredictions] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const predResponse = await getPredictions();
      setPredictions(predResponse.data.locations);

      const hotResponse = await getHotspots();
      setHotspots(hotResponse.data.hotspots);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }, [navigate]);

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, [fetchData]);

  const handleUpload = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);
    setToast(null);

    try {
      const response = await uploadCsv(file, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      });
      setToast({ message: `Successfully uploaded ${response.data.filename}`, type: 'success' });
      fetchData(); // Refresh data after upload
    } catch (error) {
      setToast({ message: 'Upload failed. Please try again.', type: 'error' });
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading && !predictions.length) {
    return <div className="flex items-center justify-center h-screen bg-wg-sand">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-wg-sand text-wg-deep">
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
      <header className="bg-wg-sand shadow-md">
        <div className="container max-w-7xl px-4 mx-auto">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-3xl font-bold text-wg-deep">WildGuard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 font-semibold text-white transition-colors duration-300 rounded-md bg-wg-forest hover:bg-wg-deep"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl p-4 mx-auto">
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-wg-deep">Upload Poaching Data</h2>
          <CsvUploader 
            onUpload={handleUpload} 
            isUploading={isUploading}
            uploadProgress={uploadProgress}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-wg-deep">Poaching Risk Map</h2>
            <MapView hotspots={hotspots} />
          </div>

          <div className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-wg-deep">Risk Predictions</h2>
            <PredictionTable predictions={predictions} />
          </div>
        </div>

        <EducationalContent />
      </main>
    </div>
  );
}

export default Dashboard;