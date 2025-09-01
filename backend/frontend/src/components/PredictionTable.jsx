import React from 'react';

function PredictionTable({ predictions }) {
  const sortedPredictions = [...predictions].sort((a, b) => b.risk - a.risk);
  const topPredictions = sortedPredictions.slice(0, 20);

  return (
    <div className="overflow-y-auto max-h-96">
      <table className="w-full">
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            <th className="px-4 py-2 text-left">Location</th>
            <th className="px-4 py-2 text-left">Risk Score</th>
          </tr>
        </thead>
        <tbody>
          {topPredictions.map((pred, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">
                {pred.lat.toFixed(2)}°, {pred.long.toFixed(2)}°
              </td>
              <td className="px-4 py-2">
                <span className={`font-semibold ${pred.risk > 0.7 ? 'text-red-600' : pred.risk > 0.4 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {(pred.risk * 100).toFixed(1)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PredictionTable;