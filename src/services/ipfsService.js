/**
 * IPFS Service using Pinata
 * Handles uploading tree metadata and SVG images to IPFS
 */

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY
const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs/'

export class IPFSService {
  constructor() {
    this.apiKey = PINATA_API_KEY
    this.secretKey = PINATA_SECRET_KEY
    this.gateway = PINATA_GATEWAY
  }

  /**
   * Upload JSON metadata to IPFS
   */
  async uploadJSON(data, name) {
    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: this.apiKey,
          pinata_secret_api_key: this.secretKey
        },
        body: JSON.stringify({
          pinataContent: data,
          pinataMetadata: {
            name: name
          }
        })
      })

      if (!response.ok) {
        throw new Error(`IPFS upload failed: ${response.statusText}`)
      }

      const result = await response.json()
      return {
        hash: result.IpfsHash,
        url: `${this.gateway}${result.IpfsHash}`
      }
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error)
      throw error
    }
  }

  /**
   * Upload SVG file to IPFS
   */
  async uploadSVG(svgContent, name) {
    try {
      // Convert SVG string to Blob
      const blob = new Blob([svgContent], { type: 'image/svg+xml' })
      const formData = new FormData()
      formData.append('file', blob, `${name}.svg`)

      const metadata = JSON.stringify({
        name: name
      })
      formData.append('pinataMetadata', metadata)

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          pinata_api_key: this.apiKey,
          pinata_secret_api_key: this.secretKey
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`IPFS upload failed: ${response.statusText}`)
      }

      const result = await response.json()
      return {
        hash: result.IpfsHash,
        url: `${this.gateway}${result.IpfsHash}`
      }
    } catch (error) {
      console.error('Error uploading SVG to IPFS:', error)
      throw error
    }
  }

  /**
   * Generate and upload complete tree metadata
   */
  async uploadTreeMetadata(tree, svgContent) {
    try {
      // 1. Upload SVG image first
      const imageUpload = await this.uploadSVG(
        svgContent,
        `tree-${tree.id}-stage-${tree.growthStage}`
      )

      // 2. Create metadata object (ERC-721 standard)
      const metadata = {
        name: `${this.getSpeciesName(tree.species)} #${tree.id}`,
        description: `A ${this.getStageName(tree.growthStage)} ${this.getSpeciesName(tree.species)} tree that has offset ${tree.carbonOffset}g of CO2. Watered ${tree.waterCount} times.`,
        image: imageUpload.url,
        external_url: `https://chaintrees.app/tree/${tree.id}`,
        attributes: [
          {
            trait_type: 'Species',
            value: this.getSpeciesName(tree.species)
          },
          {
            trait_type: 'Growth Stage',
            value: this.getStageName(tree.growthStage)
          },
          {
            display_type: 'number',
            trait_type: 'Water Count',
            value: tree.waterCount
          },
          {
            display_type: 'number',
            trait_type: 'Carbon Offset (g)',
            value: tree.carbonOffset
          },
          {
            display_type: 'number',
            trait_type: 'Generation Seed',
            value: tree.generationSeed
          },
          {
            trait_type: 'Rarity',
            value: this.getRarity(tree.growthStage)
          }
        ]
      }

      // 3. Upload metadata JSON
      const metadataUpload = await this.uploadJSON(metadata, `tree-${tree.id}-metadata`)

      return {
        metadataHash: metadataUpload.hash,
        metadataUrl: metadataUpload.url,
        imageHash: imageUpload.hash,
        imageUrl: imageUpload.url
      }
    } catch (error) {
      console.error('Error uploading tree metadata:', error)
      throw error
    }
  }

  /**
   * Batch upload metadata for multiple trees
   */
  async uploadBatchMetadata(trees, svgContents) {
    const results = []

    for (let i = 0; i < trees.length; i++) {
      try {
        const result = await this.uploadTreeMetadata(trees[i], svgContents[i])
        results.push({
          tokenId: trees[i].id,
          success: true,
          ...result
        })
      } catch (error) {
        results.push({
          tokenId: trees[i].id,
          success: false,
          error: error.message
        })
      }
    }

    return results
  }

  /**
   * Get IPFS URL from hash
   */
  getIPFSUrl(hash) {
    return `${this.gateway}${hash}`
  }

  /**
   * Helper: Get species name
   */
  getSpeciesName(species) {
    const names = ['Oak', 'Maple', 'Pine', 'Birch', 'Willow', 'Cherry', 'Redwood', 'Sequoia']
    return names[species] || 'Unknown'
  }

  /**
   * Helper: Get stage name
   */
  getStageName(stage) {
    const stages = ['Seedling', 'Sapling', 'Mature', 'Ancient']
    return stages[stage] || 'Unknown'
  }

  /**
   * Helper: Get rarity based on stage
   */
  getRarity(stage) {
    const rarities = ['Common', 'Uncommon', 'Rare', 'Legendary']
    return rarities[stage] || 'Common'
  }

  /**
   * Check if IPFS is configured
   */
  isConfigured() {
    return !!(this.apiKey && this.secretKey && this.apiKey !== 'your_pinata_api_key')
  }
}

export const ipfsService = new IPFSService()
