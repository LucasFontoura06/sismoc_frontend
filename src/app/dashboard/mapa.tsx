// Coordenadas GIT: https://gist.github.com/ricardobeat/674646


"use client";

import styles from './dashboard.module.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';

import React, { useEffect } from 'react';
import { LatLngTuple } from 'leaflet';

const heatmapData: [LatLngTuple, number][] = [
  [[-15.7801, -47.9292], 1000000], // Brasília
  [[-22.9068, -43.1729], 6000000], // Rio de Janeiro
  [[-23.5505, -46.6333], 12000000], // São Paulo
  [[-12.9714, -38.5014], 2900000], // Salvador
  [[-3.1190, -60.0217], 2200000]   // Manaus
];

const Mapa: React.FC = () => {
  useEffect(() => {
    const map = L.map('dashboard-map').setView([-14.2350, -51.9253], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const heatLayer = L.heatLayer(heatmapData.map(([latlng, value]) => [...latlng, value]), {
      radius: 45,
      blur: 70,
      gradient: {
        0.0: 'blue',
        0.1: 'cyan',
        0.2: 'lime',
        0.4: 'yellow',
        0.6: 'orange',
        0.8: 'red',
        1.0: 'darkred'
      }
    });

    heatLayer.addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div id="dashboard-map" className={styles.mapContainer}></div>
  );
};

export default Mapa;
