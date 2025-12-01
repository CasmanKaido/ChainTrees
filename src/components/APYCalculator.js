export class APYCalculator {
  constructor(containerId) {
    this.containerId = containerId
    this.baseAPY = 5 // 5% base
    this.lockMultipliers = {
      0: 1, // No lock
      30: 1.2, // 30 days
      90: 1.5, // 90 days
      180: 2.0, // 180 days
      365: 3.0 // 365 days
    }
  }

  calculate(amount, days) {
    const multiplier = this.lockMultipliers[days] || 1
    const apy = this.baseAPY * multiplier
    const dailyRate = apy / 365 / 100
    const estimatedRewards = amount * dailyRate * days

    return {
      apy: apy.toFixed(2),
      rewards: estimatedRewards.toFixed(2),
      total: (Number(amount) + estimatedRewards).toFixed(2)
    }
  }

  render(amount, days) {
    const container = document.getElementById(this.containerId)
    if (!container) return

    const result = this.calculate(amount || 0, days)

    container.innerHTML = `
      <div class="calculator-panel">
        <h3 class="mb-4">ROI Calculator</h3>
        
        <div class="calc-row">
          <span class="calc-label">Lock Period</span>
          <span class="calc-val">${days} Days</span>
        </div>
        
        <div class="calc-row">
          <span class="calc-label">APY Multiplier</span>
          <span class="calc-val">${this.lockMultipliers[days]}x</span>
        </div>
        
        <div class="calc-row">
          <span class="calc-label">Effective APY</span>
          <span class="calc-val text-green">${result.apy}%</span>
        </div>
        
        <div class="calc-row">
          <span class="calc-label">Est. Rewards</span>
          <span class="calc-val text-green">+${result.rewards} TREE</span>
        </div>
        
        <div class="calc-row" style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
          <span class="calc-label">Total Value</span>
          <span class="calc-val" style="font-size: 1.2rem;">${result.total} TREE</span>
        </div>
      </div>
    `
  }
}
