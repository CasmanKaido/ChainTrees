export class ImpactCalculator {
    constructor(containerId, totalCarbonKg) {
        this.containerId = containerId;
        this.totalCarbonKg = totalCarbonKg;
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const comparisons = this.calculateComparisons();

        container.innerHTML = `
      <div class="calculator-grid">
        <div class="impact-visualizer">
          <div class="impact-circle">
            <span class="total">${this.formatNumber(this.totalCarbonKg)}</span>
            <span class="unit">kg CO2e</span>
          </div>
          <p>Total Carbon Offset</p>
          <small>Equivalent to planting ${Math.round(this.totalCarbonKg / 22)} standard trees</small>
        </div>

        <div class="comparison-items">
          <div class="comparison-item">
            <span class="comparison-icon">🚗</span>
            <span class="comparison-value">${this.formatNumber(comparisons.carMiles)}</span>
            <span class="comparison-label">Car Miles Driven</span>
          </div>
          <div class="comparison-item">
            <span class="comparison-icon">✈️</span>
            <span class="comparison-value">${this.formatNumber(comparisons.flights)}</span>
            <span class="comparison-label">Flights (NY-London)</span>
          </div>
          <div class="comparison-item">
            <span class="comparison-icon">📱</span>
            <span class="comparison-value">${this.formatNumber(comparisons.smartphones)}</span>
            <span class="comparison-label">Smartphones Charged</span>
          </div>
          <div class="comparison-item">
            <span class="comparison-icon">🧊</span>
            <span class="comparison-value">${this.formatNumber(comparisons.ice)}</span>
            <span class="comparison-label">m² Arctic Ice Saved</span>
          </div>
        </div>
      </div>
    `;
    }

    calculateComparisons() {
        // Conversion factors
        // Car: ~0.404 kg CO2 per mile
        // Flight (NY-London): ~986 kg CO2
        // Smartphone charge: ~0.008 kg CO2
        // Arctic ice: ~3kg CO2 melts 1kg ice (approx)

        return {
            carMiles: Math.round(this.totalCarbonKg / 0.404),
            flights: (this.totalCarbonKg / 986).toFixed(1),
            smartphones: Math.round(this.totalCarbonKg / 0.008),
            ice: (this.totalCarbonKg / 3).toFixed(1)
        };
    }

    formatNumber(num) {
        return new Intl.NumberFormat().format(num);
    }
}
