import React from 'react';

const EducationalContent = () => {
  return (
    <div className="p-6 mt-8 bg-white rounded-xl shadow-md">
      <h2 className="mb-4 text-xl font-semibold text-wg-deep">Did you know?</h2>
      <ul className="space-y-2 list-disc list-inside text-wg-muted">
        <li>African elephants have declined by 60% in the last decade, with approximately 35,000 elephants killed annually for their ivory tusks.</li>
        <li>Community-based conservation programs that provide alternative livelihoods to local populations have reduced poaching incidents by up to 70% in protected areas.</li>
        <li>Advanced technologies like thermal imaging drones and AI-powered camera traps help rangers detect poachers 3x faster than traditional patrol methods.</li>
      </ul>
    </div>
  );
};

export default EducationalContent;