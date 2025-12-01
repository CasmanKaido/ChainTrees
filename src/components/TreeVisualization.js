export class TreeVisualization {
  constructor(containerId, treeData) {
    this.containerId = containerId
    this.treeData = treeData
    this.isWatering = false
    this.currentWeather = 'sunny'
  }

  render() {
    const container = document.getElementById(this.containerId)
    if (!container) return

    container.innerHTML = `
      <div class="tree-visualization-container ${this.currentWeather === 'night' ? 'night' : ''}">
        <div class="viz-controls">
          <button class="viz-btn" id="toggle-weather" title="Toggle Weather">
            <i class="fas fa-cloud-sun"></i>
          </button>
          <button class="viz-btn" id="water-btn" title="Water Tree">
            <i class="fas fa-tint"></i>
          </button>
        </div>

        <div class="weather-layer" id="weather-layer"></div>

        <div class="watering-can" id="watering-can">
          🚿
          <div class="water-stream"></div>
        </div>

        <div class="tree-svg-container tree-stage-${this.treeData.stage.toLowerCase()}">
          ${this.getTreeSVG(this.treeData.species)}
        </div>

        <div class="ground">
          <div class="grass"></div>
        </div>
      </div>
    `

    this.attachListeners()
    this.startWeatherEffect()
  }

  attachListeners() {
    document.getElementById('water-btn').addEventListener('click', () => this.waterTree())
    document.getElementById('toggle-weather').addEventListener('click', () => this.toggleWeather())
  }

  waterTree() {
    if (this.isWatering) return
    this.isWatering = true

    const can = document.getElementById('watering-can')
    can.classList.add('active')

    // Create particles
    this.createWaterParticles()

    setTimeout(() => {
      can.classList.remove('active')
      this.isWatering = false

      // Trigger growth pulse
      const tree = document.querySelector('.tree-svg-container')
      tree.style.transform = 'scale(1.1)'
      setTimeout(() => {
        tree.style.transform = ''
      }, 300)
    }, 2000)
  }

  createWaterParticles() {
    const container = document.querySelector('.tree-visualization-container')
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div')
      particle.className = 'rain-drop'
      particle.style.left = '50%'
      particle.style.top = '40%'
      particle.style.background = '#3b82f6'
      particle.style.width = '4px'
      particle.style.height = '4px'
      particle.style.borderRadius = '50%'
      particle.style.animationDuration = Math.random() * 0.5 + 0.5 + 's'

      container.appendChild(particle)

      setTimeout(() => particle.remove(), 1000)
    }
  }

  toggleWeather() {
    const weathers = ['sunny', 'rainy', 'snowy', 'night']
    const currentIndex = weathers.indexOf(this.currentWeather)
    this.currentWeather = weathers[(currentIndex + 1) % weathers.length]

    this.render() // Re-render to update classes
  }

  startWeatherEffect() {
    const layer = document.getElementById('weather-layer')
    layer.innerHTML = ''

    if (this.currentWeather === 'rainy') {
      this.createRain(layer)
    } else if (this.currentWeather === 'snowy') {
      this.createSnow(layer)
    }
  }

  createRain(container) {
    setInterval(() => {
      const drop = document.createElement('div')
      drop.className = 'rain-drop'
      drop.style.left = Math.random() * 100 + '%'
      drop.style.animationDuration = Math.random() * 0.5 + 0.5 + 's'
      container.appendChild(drop)
      setTimeout(() => drop.remove(), 1000)
    }, 50)
  }

  createSnow(container) {
    setInterval(() => {
      const flake = document.createElement('div')
      flake.className = 'snow-flake'
      flake.style.left = Math.random() * 100 + '%'
      flake.style.animationDuration = Math.random() * 2 + 2 + 's'
      container.appendChild(flake)
      setTimeout(() => flake.remove(), 4000)
    }, 100)
  }

  getTreeSVG(species) {
    // Simplified SVG for demonstration
    // In production, this would be the actual procedural SVG from the contract/generator
    const colors = {
      Oak: '#22c55e',
      Maple: '#ef4444',
      Pine: '#15803d',
      Birch: '#facc15'
    }
    const color = colors[species] || '#22c55e'

    return `
      <svg width="200" height="300" viewBox="0 0 200 300">
        <!-- Trunk -->
        <path d="M90,300 L110,300 L105,200 L95,200 Z" fill="#5d4037" />
        <path d="M95,200 L105,200 L100,100" stroke="#5d4037" stroke-width="10" />
        
        <!-- Leaves -->
        <circle cx="100" cy="100" r="60" fill="${color}" />
        <circle cx="70" cy="120" r="40" fill="${color}" />
        <circle cx="130" cy="120" r="40" fill="${color}" />
        <circle cx="100" cy="60" r="50" fill="${color}" />
      </svg>
    `
  }
}
