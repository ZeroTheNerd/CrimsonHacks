import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './ChartsPanel.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartsPanel = ({ history }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#a0aec0',
          font: {
            family: 'Space Grotesk',
            size: 11,
          },
          boxWidth: 12,
          boxHeight: 12,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(20, 27, 61, 0.9)',
        titleColor: '#00d9ff',
        bodyColor: '#ffffff',
        borderColor: '#00d9ff',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(2);
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: '#a0aec0',
          font: {
            family: 'Space Grotesk',
            size: 10,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: '#a0aec0',
          font: {
            family: 'Space Grotesk',
            size: 10,
          },
        },
      },
    },
  };

  const temperatureData = useMemo(() => {
    return {
      labels: history.map(h => Math.floor(h.year)),
      datasets: [
        {
          label: 'Temperature (°C)',
          data: history.map(h => h.temperature),
          borderColor: '#ff6b35',
          backgroundColor: 'rgba(255, 107, 53, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
      ],
    };
  }, [history]);

  const pressureData = useMemo(() => {
    return {
      labels: history.map(h => Math.floor(h.year)),
      datasets: [
        {
          label: 'Pressure (kPa)',
          data: history.map(h => h.pressure),
          borderColor: '#00d9ff',
          backgroundColor: 'rgba(0, 217, 255, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
      ],
    };
  }, [history]);

  const atmosphereData = useMemo(() => {
    return {
      labels: history.map(h => Math.floor(h.year)),
      datasets: [
        {
          label: 'Oxygen (%)',
          data: history.map(h => h.oxygen),
          borderColor: '#4ecdc4',
          backgroundColor: 'rgba(78, 205, 196, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
        {
          label: 'CO2 (%)',
          data: history.map(h => h.co2),
          borderColor: '#ff6b35',
          backgroundColor: 'rgba(255, 107, 53, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
        {
          label: 'Water Vapor (%)',
          data: history.map(h => h.waterVapor),
          borderColor: '#00d9ff',
          backgroundColor: 'rgba(0, 217, 255, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
      ],
    };
  }, [history]);

  if (history.length < 2) {
    return (
      <div className="charts-panel">
        <div className="no-data">Simulation starting... Data will appear shortly.</div>
      </div>
    );
  }

  return (
    <div className="charts-panel">
      <div className="chart-container">
        <h3 className="chart-title">Temperature Over Time</h3>
        <div className="chart-wrapper">
          <Line options={chartOptions} data={temperatureData} />
        </div>
      </div>

      <div className="chart-container">
        <h3 className="chart-title">Atmospheric Pressure</h3>
        <div className="chart-wrapper">
          <Line options={chartOptions} data={pressureData} />
        </div>
      </div>

      <div className="chart-container">
        <h3 className="chart-title">Atmospheric Composition</h3>
        <div className="chart-wrapper">
          <Line options={chartOptions} data={atmosphereData} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChartsPanel);
