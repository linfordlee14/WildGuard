import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';

const CsvUploader = ({ onUpload, uploadProgress, isUploading }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState([]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      setError('Only .csv files are accepted.');
      setFile(null);
      setPreview([]);
      return;
    }

    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setError('');
    parseCsv(selectedFile);
  }, []);

  const parseCsv = (fileToParse) => {
    Papa.parse(fileToParse, {
      header: true,
      preview: 5,
      complete: (results) => {
        setPreview(results.data);
      },
    });
  };

  const handleUpload = () => {
    if (file) {
      onUpload(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
  });

  return (
    <div className="w-full p-6 transition-all duration-300 bg-white border-2 border-dashed rounded-xl shadow-md border-wg-muted/30 hover:border-wg-accent">
      <div {...getRootProps()} className={`cursor-pointer text-center p-8 rounded-lg ${isDragActive ? 'bg-wg-accent/20' : 'bg-wg-sand'}`}>
        <input {...getInputProps()} />
        <p className="text-lg font-semibold text-wg-deep">Drag & drop a CSV file here, or click to select one</p>
        <p className="text-sm text-wg-muted">Max file size: 5MB</p>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {file && !isUploading && (
        <div className="mt-4">
          <p className="font-medium text-wg-deep">Selected file: <span className="font-normal text-wg-muted">{file.name}</span></p>
        </div>
      )}

      {preview.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold text-wg-deep">CSV Preview (first 5 rows):</h3>
          <div className="overflow-x-auto">
            <table className="w-full mt-2 text-sm text-left text-wg-deep">
              <thead className="text-xs uppercase bg-wg-sand text-wg-deep">
                <tr>
                  {Object.keys(preview[0]).map((key) => (
                    <th key={key} scope="col" className="px-4 py-2">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className="bg-white border-b border-wg-sand">
                    {Object.values(row).map((value, j) => (
                      <td key={j} className="px-4 py-2">{String(value)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="mt-4">
          <p className="font-medium text-wg-deep">Uploading...</p>
          <div className="w-full mt-1 bg-wg-sand rounded-full h-2.5">
            <div className="bg-wg-forest h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-6">
        <a href="/sample_data/sample_upload.csv" download className="text-sm font-medium text-wg-forest hover:underline">Download Sample CSV</a>
        <button 
          onClick={handleUpload} 
          disabled={!file || isUploading}
          className="px-6 py-2 font-bold text-white transition-colors duration-300 rounded-md bg-wg-accent hover:bg-wg-deep disabled:bg-wg-muted disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  );
};

export default CsvUploader;