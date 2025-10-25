import React, { useState, useEffect, useRef } from 'react';
import MarsVisualization from './components/MarsVisualization';
import ControlPanel from './components/ControlPanel';
import ChartsPanel from './components/ChartsPanel';
import StatsPanel from './components/StatsPanel';
import { MarsTerraformingPhysics } from './physics/MarsTerraformingPhysics';
import './App.css';

function App() {
  const physicsEngineRef = useRef(new MarsTerraformingPhysics());
  const [physicsState, setPhysicsState] = useState(physicsEngineRef.current.getState());
  const [isPaused, setIsPaused] = useState(false);
  const [timeSpeed, setTimeSpeed] = useState(100);
  const lastUpdateTimeRef = useRef(Date.now());

  useEffect(() => {
    const updateSimulation = () => {
      if (isPaused) {
        lastUpdateTimeRef.current = Date.now();
        return;
      }

      const now = Date.now();
      const deltaTime = (now - lastUpdateTimeRef.current) / 1000;
      lastUpdateTimeRef.current = now;

      const deltaYears = deltaTime * (timeSpeed / 100);

      physicsEngineRef.current.update(deltaYears);
      physicsEngineRef.current.recordHistory();

      setPhysicsState(physicsEngineRef.current.getState());
    };

    const intervalId = setInterval(updateSimulation, 1000 / 60);

    return () => clearInterval(intervalId);
  }, [isPaused, timeSpeed]);

  const handleInterventionChange = (key, value) => {
    physicsEngineRef.current.interventions[key] = value;
  };

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
  };

  const handleTimeSpeedChange = (speed) => {
    setTimeSpeed(speed);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="mars-icon">🔴</span>
            Mars Terraforming Simulator
          </h1>
          <p className="app-subtitle">Real-time Climate Physics & 3D Visualization</p>
        </div>
      </header>

      <div className="main-content">
        <div className="visualization-section">
          <MarsVisualization physicsState={physicsState} />
        </div>

        <div className="control-section">
          <div className="control-panel-container">
            <ControlPanel
              interventions={physicsEngineRef.current.interventions}
              onInterventionChange={handleInterventionChange}
              timeSpeed={timeSpeed}
              onTimeSpeedChange={handleTimeSpeedChange}
              isPaused={isPaused}
              onPauseToggle={handlePauseToggle}
              year={physicsState.year}
            />
          </div>

          <div className="charts-panel-container">
            <ChartsPanel history={physicsState.history} />
          </div>

          <div className="stats-panel-container">
            <StatsPanel physicsState={physicsState} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
