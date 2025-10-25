export class MarsTerraformingPhysics {
  constructor() {
    this.temperature = -63;
    this.pressure = 0.61;
    this.co2Percentage = 96;
    this.oxygenPercentage = 0.145;
    this.waterVaporPercentage = 0.1;
    this.nitrogenPercentage = 1.9;
    this.argonPercentage = 1.9;

    this.interventions = {
      releaseGreenhouseGases: false,
      deployCyanobacteria: false,
      meltPolarIceCaps: false,
      magneticShield: false,
      importNitrogen: false,
    };

    this.year = 0;
    this.history = [];
  }

  update(deltaYears) {
    this.year += deltaYears;

    const greenhouseForcing = (this.co2Percentage / 100) * 10 + (this.waterVaporPercentage / 100) * 15;

    let tempChange = greenhouseForcing * 0.01 * deltaYears;

    if (this.temperature > -40) {
      let meltRate = (this.temperature + 40) * 0.001 * deltaYears;

      if (this.interventions.meltPolarIceCaps) {
        meltRate *= 3;
      }

      this.co2Percentage += meltRate * 0.5;
      this.waterVaporPercentage += meltRate * 0.8;
      this.pressure += meltRate * 0.1;
    }

    if (this.interventions.releaseGreenhouseGases) {
      this.co2Percentage += 0.1 * deltaYears;
      this.pressure += 0.05 * deltaYears;
      tempChange += 0.05 * deltaYears;
    }

    if (this.interventions.deployCyanobacteria && this.temperature > -20) {
      const oxygenProduction = 0.001 * deltaYears * Math.min(1, (this.temperature + 20) / 40);
      this.oxygenPercentage += oxygenProduction;
      this.co2Percentage -= oxygenProduction * 0.5;
    }

    if (this.interventions.importNitrogen) {
      this.nitrogenPercentage += 0.5 * deltaYears;
      this.pressure += 0.2 * deltaYears;
    }

    if (!this.interventions.magneticShield && this.pressure > 1) {
      const atmosphericLoss = 0.001 * deltaYears;
      this.pressure -= atmosphericLoss;
    }

    this.temperature += tempChange;

    this.normalizePercentages();

    this.temperature = Math.max(-100, Math.min(50, this.temperature));
    this.pressure = Math.max(0.1, Math.min(150, this.pressure));
  }

  normalizePercentages() {
    const total = this.co2Percentage + this.oxygenPercentage +
                  this.waterVaporPercentage + this.nitrogenPercentage + this.argonPercentage;

    if (total > 100) {
      const scale = 100 / total;
      this.co2Percentage *= scale;
      this.oxygenPercentage *= scale;
      this.waterVaporPercentage *= scale;
      this.nitrogenPercentage *= scale;
      this.argonPercentage *= scale;
    }
  }

  calculateHabitabilityScore() {
    let score = 0;

    if (this.temperature >= -10 && this.temperature <= 30) {
      score += 30;
    } else if (this.temperature > -20 && this.temperature < -10) {
      score += 15;
    } else if (this.temperature > 30 && this.temperature < 40) {
      score += 15;
    }

    if (this.pressure >= 6) {
      score += 30;
    } else if (this.pressure >= 3) {
      score += 15;
    }

    if (this.oxygenPercentage >= 15) {
      score += 20;
    } else if (this.oxygenPercentage >= 10) {
      score += 10;
    }

    if (this.waterVaporPercentage >= 1) {
      score += 20;
    } else if (this.waterVaporPercentage >= 0.5) {
      score += 10;
    }

    return Math.min(100, score);
  }

  getTextureBlendFactors() {
    const temp = this.temperature;
    const oxygen = this.oxygenPercentage;

    let marsToWarming = 0;
    let warmingToAtmosphere = 0;
    let atmosphereToOcean = 0;
    let oceanToTerraformed = 0;

    if (temp < -40) {
      marsToWarming = 0;
    } else if (temp < 0) {
      marsToWarming = (temp + 40) / 40;
    } else {
      marsToWarming = 1;
    }

    if (temp < 0) {
      warmingToAtmosphere = 0;
    } else if (temp < 10) {
      warmingToAtmosphere = temp / 10;
    } else {
      warmingToAtmosphere = 1;
    }

    if (temp < 10) {
      atmosphereToOcean = 0;
    } else if (temp < 15) {
      atmosphereToOcean = (temp - 10) / 5;
    } else {
      atmosphereToOcean = 1;
    }

    if (temp < 15 || oxygen < 5) {
      oceanToTerraformed = 0;
    } else if (temp < 20 && oxygen < 15) {
      oceanToTerraformed = Math.min((temp - 15) / 5, oxygen / 15);
    } else {
      oceanToTerraformed = Math.min(1, oxygen / 15);
    }

    return {
      marsToWarming,
      warmingToAtmosphere,
      atmosphereToOcean,
      oceanToTerraformed,
    };
  }

  getAtmosphereGlowIntensity() {
    return Math.min(1, this.pressure / 50);
  }

  getCloudOpacity() {
    if (this.waterVaporPercentage < 2) return 0;
    return Math.min(0.6, (this.waterVaporPercentage - 2) / 10);
  }

  estimateYearsToHabitability() {
    const currentScore = this.calculateHabitabilityScore();
    if (currentScore >= 95) return 0;

    const recentHistory = this.history.slice(-10);
    if (recentHistory.length < 2) return Infinity;

    const scoreChange = currentScore - recentHistory[0].habitability;
    const yearsElapsed = this.year - recentHistory[0].year;

    if (scoreChange <= 0) return Infinity;

    const rate = scoreChange / yearsElapsed;
    const remaining = 100 - currentScore;

    return Math.ceil(remaining / rate);
  }

  recordHistory() {
    this.history.push({
      year: this.year,
      temperature: this.temperature,
      pressure: this.pressure,
      oxygen: this.oxygenPercentage,
      co2: this.co2Percentage,
      waterVapor: this.waterVaporPercentage,
      habitability: this.calculateHabitabilityScore(),
    });

    if (this.history.length > 500) {
      this.history.shift();
    }
  }

  getState() {
    return {
      year: this.year,
      temperature: this.temperature,
      pressure: this.pressure,
      co2Percentage: this.co2Percentage,
      oxygenPercentage: this.oxygenPercentage,
      waterVaporPercentage: this.waterVaporPercentage,
      nitrogenPercentage: this.nitrogenPercentage,
      argonPercentage: this.argonPercentage,
      habitabilityScore: this.calculateHabitabilityScore(),
      textureBlendFactors: this.getTextureBlendFactors(),
      atmosphereGlowIntensity: this.getAtmosphereGlowIntensity(),
      cloudOpacity: this.getCloudOpacity(),
      history: this.history,
    };
  }
}
