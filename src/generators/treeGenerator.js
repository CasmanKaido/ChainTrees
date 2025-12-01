/**
 * Procedural Tree Generator
 * Generates unique SVG trees based on species and seed
 */
export class TreeGenerator {
  constructor() {
    this.colors = {
      trunk: ['#8B4513', '#654321', '#5D4037', '#795548', '#4E342E'],
      leaves: {
        0: ['#228B22', '#006400', '#32CD32'], // Oak - Green
        1: ['#FF4500', '#FF8C00', '#D2691E'], // Maple - Orange/Red
        2: ['#2E8B57', '#006400', '#556B2F'], // Pine - Dark Green
        3: ['#90EE90', '#98FB98', '#3CB371'], // Birch - Light Green
        4: ['#9ACD32', '#6B8E23', '#556B2F'], // Willow - Yellow Green
        5: ['#FFB7C5', '#FF69B4', '#FF1493'], // Cherry - Pink
        6: ['#8B0000', '#A52A2A', '#B22222'], // Redwood - Reddish Brown
        7: ['#006400', '#004d00', '#003300'] // Sequoia - Deep Green
      }
    }
  }

  /**
   * Generate a deterministic random number based on seed
   */
  random(seed) {
    const x = Math.sin(seed++) * 10000
    return x - Math.floor(x)
  }

  /**
   * Generate SVG for a tree
   * @param {number} species - Tree species ID (0-7)
   * @param {number} seed - Unique seed for generation
   * @param {number} stage - Growth stage (0-3): Seedling, Sapling, Mature, Ancient
   */
  generateSVG(species, seed, stage = 3) {
    let currentSeed = seed
    const rand = () => this.random(currentSeed++)

    // Enhanced scale progression for dramatic visual differences
    const stageScales = [0.3, 0.55, 0.8, 1.0] // Seedling, Sapling, Mature, Ancient
    const scale = stageScales[Math.min(stage, 3)]

    // Trunk properties - grow with stage
    const baseWidth = 8 + rand() * 4
    const baseHeight = 35 + rand() * 15
    const trunkWidth = baseWidth * (0.5 + stage * 0.25) // Thicker trunk as it grows
    const trunkHeight = baseHeight * (0.6 + stage * 0.2) // Taller trunk as it grows
    const trunkColor = this.colors.trunk[Math.floor(rand() * this.colors.trunk.length)]

    // Leaf properties - dramatically increase with stage
    const leafColors = this.colors.leaves[species] || this.colors.leaves[0]
    const baseLeafCount = 10 + Math.floor(rand() * 8)
    const leafCount = Math.floor(baseLeafCount * (1 + stage * 0.8)) // More leaves per stage

    let svgContent = ''

    // Draw Trunk with stage-based complexity
    if (stage === 0) {
      // Seedling - simple thin stem
      svgContent += `<line x1="50" y1="90" x2="50" y2="${90 - trunkHeight}" 
                stroke="${trunkColor}" stroke-width="${trunkWidth}" stroke-linecap="round"/>`
    } else {
      // Mature trunk with texture
      svgContent += `<path d="M50,90 L50,${90 - trunkHeight} M${50 - trunkWidth / 2},90 Q50,${90 - trunkHeight / 2} ${50 + trunkWidth / 2},90" 
                stroke="${trunkColor}" stroke-width="${trunkWidth}" fill="${trunkColor}" stroke-linecap="round"/>`

      // Add branches for mature trees
      if (stage >= 2) {
        const branchCount = stage === 2 ? 2 : 4
        for (let b = 0; b < branchCount; b++) {
          const branchY = 90 - trunkHeight * (0.3 + b * 0.2)
          const branchAngle = (b % 2 === 0 ? -1 : 1) * (30 + rand() * 20)
          const branchLength = 15 + rand() * 10
          const branchEndX = 50 + Math.sin((branchAngle * Math.PI) / 180) * branchLength
          const branchEndY = branchY - Math.cos((branchAngle * Math.PI) / 180) * branchLength

          svgContent += `<line x1="50" y1="${branchY}" x2="${branchEndX}" y2="${branchEndY}" 
                        stroke="${trunkColor}" stroke-width="${trunkWidth * 0.4}" stroke-linecap="round"/>`
        }
      }
    }

    // Draw Leaves/Foliage - positioned based on stage
    const canopyY = 90 - trunkHeight
    const canopyRadius = 25 * scale

    for (let i = 0; i < leafCount; i++) {
      const angle = rand() * Math.PI * 2
      const distance = rand() * canopyRadius
      const cx = 50 + Math.cos(angle) * distance
      const cy = canopyY + Math.sin(angle) * distance * 0.7 - stage * 3 // Lift canopy as it grows
      const r = (4 + rand() * 6) * scale
      const color = leafColors[Math.floor(rand() * leafColors.length)]
      const opacity = 0.7 + rand() * 0.2

      if (species === 2) {
        // Pine - Triangles
        svgContent += `<polygon points="${cx},${cy - r} ${cx - r},${cy + r} ${cx + r},${cy + r}" 
                    fill="${color}" opacity="${opacity}"/>`
      } else {
        // Others - Circles
        svgContent += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="${opacity}"/>`
      }
    }

    // Add sparkle effect for Ancient trees
    if (stage === 3) {
      for (let s = 0; s < 3; s++) {
        const sx = 30 + rand() * 40
        const sy = 20 + rand() * 40
        svgContent += `<circle cx="${sx}" cy="${sy}" r="1" fill="#FFD700" opacity="0.8">
                    <animate attributeName="opacity" values="0.8;0.3;0.8" dur="${1 + rand()}s" repeatCount="indefinite"/>
                </circle>`
      }
    }

    return `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow-${seed}" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="1" dy="1" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="offsetblur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <g filter="url(#shadow-${seed})">
          ${svgContent}
        </g>
      </svg>
    `
  }

  /**
   * Get stage name from stage number
   */
  getStageName(stage) {
    const stages = ['Seedling', 'Sapling', 'Mature', 'Ancient']
    return stages[Math.min(stage, 3)] || 'Unknown'
  }
}

export const treeGenerator = new TreeGenerator()
