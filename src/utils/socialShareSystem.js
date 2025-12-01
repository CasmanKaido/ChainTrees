import { activityFeedSystem } from './activityFeedSystem.js'

export class SocialShareSystem {
  /**
   * Share an achievement or action to external platforms
   * @param {string} platform 'twitter', 'facebook', 'telegram'
   * @param {string} text Message to share
   * @param {string} url Optional URL to include
   */
  share(platform, text, url = window.location.href) {
    const encodedText = encodeURIComponent(text)
    const encodedUrl = encodeURIComponent(url)
    let shareUrl = ''

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=ChainTrees,Web3,GreenTech`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`
        break
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
        break
      default:
        throw new Error('Unsupported platform')
    }

    // Open in new window
    window.open(shareUrl, '_blank', 'width=600,height=400')

    // Log internal activity
    activityFeedSystem.logActivity('SHARE', { platform }, 'CURRENT_USER') // Replace with actual user
  }

  /**
   * Generate share text for specific events
   */
  generateShareText(type, data) {
    switch (type) {
      case 'MINT':
        return `I just planted a ${data.species} tree on ChainTrees! 🌱 Help me reforest the world on the blockchain.`
      case 'LEVEL_UP':
        return `I just reached Level ${data.level} on ChainTrees! 🚀 Join me and earn rewards for saving the planet.`
      case 'ACHIEVEMENT':
        return `I unlocked the "${data.badge}" badge on ChainTrees! 🏆 Can you beat my score?`
      default:
        return 'Check out ChainTrees, the Web3 environmental platform! 🌳'
    }
  }
}

export const socialShareSystem = new SocialShareSystem()
