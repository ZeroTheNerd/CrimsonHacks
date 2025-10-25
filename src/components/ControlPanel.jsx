import React from 'react';
import './ControlPanel.css';

const ControlPanel = ({ interventions, onInterventionChange, timeSpeed, onTimeSpeedChange, isPaused, onPauseToggle, year }) => {
  const interventionsList = [
    {
      key: 'releaseGreenhouseGases',
      label: 'Release Greenhouse Gases',
      description: 'Actively add CO2 and CFCs to warm the atmosphere',
      icon: '🏭',
    },
    {
      key: 'deployCyanobacteria',
      label: 'Deploy Cyanobacteria',
      description: 'Seed photosynthetic bacteria to produce oxygen',
      icon: '🦠',
    },
    {
      key: 'meltPolarIceCaps',
      label: 'Melt Polar Ice Caps',
      description: 'Accelerate ice melting with orbital mirrors',
      icon: '🔆',
    },
    {
      key: 'magneticShield',
      label: 'Install Magnetic Shield',
      description: 'Prevent solar wind from stripping atmosphere',
      icon: '🛡️',
    },
    {
      key: 'importNitrogen',
      label: 'Import Nitrogen',
      description: 'Redirect asteroids to add nitrogen',
      icon: '☄️',
    },
  ];

  return (
    <div className="control-panel">
      <h2 className="panel-title">Terraforming Controls</h2>

      <div className="time-controls">
        <div className="time-display">
          <span className="time-label">Year:</span>
          <span className="time-value">{Math.floor(year)}</span>
        </div>

        <button className="pause-button" onClick={onPauseToggle}>
          {isPaused ? '▶️ Play' : '⏸️ Pause'}
        </button>

        <div className="speed-control">
          <label className="speed-label">
            Time Speed: <span className="speed-value">{timeSpeed}x</span>
          </label>
          <input
            type="range"
            min="1"
            max="1000"
            value={timeSpeed}
            onChange={(e) => onTimeSpeedChange(Number(e.target.value))}
            className="speed-slider"
          />
          <div className="speed-markers">
            <span>1x</span>
            <span>500x</span>
            <span>1000x</span>
          </div>
        </div>
      </div>

      <div className="interventions-list">
        <h3 className="interventions-title">Active Interventions</h3>
        {interventionsList.map((intervention) => (
          <div key={intervention.key} className="intervention-item">
            <label className="intervention-label">
              <input
                type="checkbox"
                checked={interventions[intervention.key]}
                onChange={(e) => onInterventionChange(intervention.key, e.target.checked)}
                className="intervention-checkbox"
              />
              <div className="intervention-content">
                <div className="intervention-header">
                  <span className="intervention-icon">{intervention.icon}</span>
                  <span className="intervention-name">{intervention.label}</span>
                </div>
                <span className="intervention-description">{intervention.description}</span>
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ControlPanel;
