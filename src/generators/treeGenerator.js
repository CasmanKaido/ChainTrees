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
                7: ['#006400', '#004d00', '#003300']  // Sequoia - Deep Green
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
     * @param {number} stage - Growth stage (0-3)
     */
    generateSVG(species, seed, stage = 3) {
        let currentSeed = seed
        const rand = () => this.random(currentSeed++)

        // Scale based on stage
        const scale = 0.4 + (stage * 0.2) // 0.4, 0.6, 0.8, 1.0

        // Trunk properties
        const trunkWidth = 10 + (rand() * 5)
        const trunkHeight = 40 + (rand() * 20)
        const trunkColor = this.colors.trunk[Math.floor(rand() * this.colors.trunk.length)]

        // Leaf properties
        const leafColors = this.colors.leaves[species] || this.colors.leaves[0]
        const leafCount = 15 + Math.floor(rand() * 10) + (stage * 10)

        let svgContent = ''

        // Draw Trunk
        svgContent += `<path d="M50,90 L50,${90 - trunkHeight} M${50 - trunkWidth / 2},90 Q50,${90 - trunkHeight / 2} ${50 + trunkWidth / 2},90" 
      stroke="${trunkColor}" stroke-width="${trunkWidth}" fill="${trunkColor}" stroke-linecap="round"/>`

        // Draw Branches & Leaves
        for (let i = 0; i < leafCount; i++) {
            const angle = (rand() * Math.PI * 2)
            const distance = (rand() * 30 * scale)
            const cx = 50 + Math.cos(angle) * distance
            const cy = (90 - trunkHeight) + Math.sin(angle) * distance * 0.8
            const r = (5 + rand() * 8) * scale
            const color = leafColors[Math.floor(rand() * leafColors.length)]

            if (species === 2) { // Pine - Triangles
                svgContent += `<polygon points="${cx},${cy - r} ${cx - r},${cy + r} ${cx + r},${cy + r}" fill="${color}" opacity="0.9"/>`
            } else { // Others - Circles
                svgContent += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="0.8"/>`
            }
        }

        return `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
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
        <g filter="url(#shadow)">
          ${svgContent}
        </g>
      </svg>
    `
    }
}

export const treeGenerator = new TreeGenerator()
