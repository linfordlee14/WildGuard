// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import L from 'leaflet';

/*
  Leaflet marker icon fix:
  When you use the Leaflet CSS/images via CDN (or serve them from /public),
  webpack won't bundle the marker images and Leaflet's default relative paths fail.
  The lines below force Leaflet to use CDN image URLs so markers show up correctly.

  IMPORTANT: make sure you do NOT import 'leaflet/dist/leaflet.css' anywhere in your src files
  (you already have the CDN <link> in public/index.html).
*/
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render( <React.StrictMode>
    <App/>
    </React.StrictMode>
);