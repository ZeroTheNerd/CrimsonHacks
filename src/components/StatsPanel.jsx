import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import './StatsPanel.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const StatsPanel = ({ physicsState }) => {
  const {
    temperature,
    pressure,
    co2Percentage,
    oxygenPercentage,
    waterVaporPercentage,
    nitrogenPercentage,
    argonPercentage,
    habitabilityScore,
  } = physicsState;

  const getTemperatureColor = (temp) => {
    if (temp < -40) return '#4299e1';
    if (temp < 0) return '#00d9ff';
    if (temp < 15) return '#f6ad55';
    if (temp < 30) return '#4ecdc4';
    return '#ff6b35';
  };

  const getTemperatureStatus = (temp) => {
    if (temp < -40) return 'Frozen';
    if (temp < 0) return 'Cold';
    if (temp < 15) return 'Cool';
    if (temp < 30) return 'Habitable';
    return 'Hot';
  };

  const pieData = useMemo(() => {
    const other = Math.max(0, 100 - co2Percentage - oxygenPercentage - waterVaporPercentage - nitrogenPercentage - argonPercentage);

    return {
      labels: ['CO2', 'O2', 'N2', 'H2O', 'Ar', 'Other'],
      datasets: [
        {
          data: [
            co2Percentage,
            oxygenPercentage,
            nitrogenPercentage,
            waterVaporPercentage,
            argonPercentage,
            other,
          ],
          backgroundColor: [
            '#ff6b35',
            '#4ecdc4',
            '#a78bfa',
            '#00d9ff',
            '#fbbf24',
            '#6b7280',
          ],
          borderColor: '#0a0e27',
          borderWidth: 2,
        },
      ],
    };
  }, [co2Percentage, oxygenPercentage, nitrogenPercentage, waterVaporPercentage, argonPercentage]);

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#a0aec0',
          font: {
            family: 'Space Grotesk',
            size: 11,
          },
          boxWidth: 12,
          boxHeight: 12,
          padding: 10,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(20, 27, 61, 0.9)',
        titleColor: '#00d9ff',
        bodyColor: '#ffffff',
        borderColor: '#00d9ff',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += context.parsed.toFixed(2) + '%';
            }
            return label;
          }
        }
      },
    },
  };

  const yearsToHabitability = useMemo(() => {
    if (habitabilityScore >= 95) return 0;

    const history = physicsState.history || [];
    if (history.length < 10) return '∞';

    const recentHistory = history.slice(-10);
    const scoreChange = habitabilityScore - recentHistory[0].habitability;
    const yearsElapsed = physicsState.year - recentHistory[0].year;

    if (scoreChange <= 0) return '∞';

    const rate = scoreChange / yearsElapsed;
    const remaining = 100 - habitabilityScore;
    const years = Math.ceil(remaining / rate);

    return years > 10000 ? '∞' : years.toLocaleString();
  }, [habitabilityScore, physicsState.history, physicsState.year]);

  return (
    <div className="stats-panel">
      <h2 className="panel-title">Current Status</h2>

      <div className="stats-grid">
        <div className="stat-card temperature-card">
          <div className="stat-icon">🌡️</div>
          <div className="stat-content">
            <div className="stat-label">Temperature</div>
            <div className="stat-value" style={{ color: getTemperatureColor(temperature) }}>
              {temperature.toFixed(1)}°C
            </div>
            <div className="stat-status">{getTemperatureStatus(temperature)}</div>
          </div>
        </div>

        <div className="stat-card pressure-card">
          <div className="stat-icon">🎈</div>
          <div className="stat-content">
            <div className="stat-label">Pressure</div>
            <div className="stat-value">{pressure.toFixed(2)} kPa</div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(100, (pressure / 101.3) * 100)}%` }}
              />
            </div>
            <div className="stat-subtext">Target: 101.3 kPa (Earth)</div>
          </div>
        </div>

        <div className="stat-card habitability-card">
          <div className="stat-icon">🌍</div>
          <div className="stat-content">
            <div className="stat-label">Habitability Score</div>
            <div className="stat-value" style={{ color: habitabilityScore > 70 ? '#4ecdc4' : habitabilityScore > 40 ? '#f6ad55' : '#ff6b35' }}>
              {habitabilityScore.toFixed(0)}%
            </div>
            <div className="progress-bar habitability-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${habitabilityScore}%`,
                  background: habitabilityScore > 70 ? 'linear-gradient(90deg, #4ecdc4, #00d9ff)' : 'linear-gradient(90deg, #ff6b35, #f6ad55)'
                }}
              />
            </div>
            <div className="stat-subtext">
              {habitabilityScore >= 95 ? '✅ Habitable!' : `Est. ${yearsToHabitability} years to habitability`}
            </div>
          </div>
        </div>
      </div>

      <div className="composition-section">
        <h3 className="section-title">Atmospheric Composition</h3>
        <div className="pie-chart-container">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>

      <div className="key-metrics">
        <div className="metric-row">
          <span className="metric-label">Oxygen:</span>
          <span className="metric-value" style={{ color: oxygenPercentage > 15 ? '#4ecdc4' : '#a0aec0' }}>
            {oxygenPercentage.toFixed(3)}%
          </span>
        </div>
        <div className="metric-row">
          <span className="metric-label">CO2:</span>
          <span className="metric-value">{co2Percentage.toFixed(2)}%</span>
        </div>
        <div className="metric-row">
          <span className="metric-label">Nitrogen:</span>
          <span className="metric-value">{nitrogenPercentage.toFixed(2)}%</span>
        </div>
        <div className="metric-row">
          <span className="metric-label">Water Vapor:</span>
          <span className="metric-value" style={{ color: waterVaporPercentage > 1 ? '#00d9ff' : '#a0aec0' }}>
            {waterVaporPercentage.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(StatsPanel);
