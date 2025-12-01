export class ShareButton {
  constructor(config) {
    this.platform = config.platform
    this.url = config.url || window.location.href
    this.text = config.text || 'Check out my forest on ChainTrees! 🌳'
    this.hashtags = config.hashtags || 'ChainTrees,Web3,ClimateAction'
  }

  render() {
    const iconMap = {
      twitter: 'fab fa-twitter',
      facebook: 'fab fa-facebook',
      discord: 'fab fa-discord',
      whatsapp: 'fab fa-whatsapp'
    }

    const labelMap = {
      twitter: 'Tweet',
      facebook: 'Share',
      discord: 'Discord',
      whatsapp: 'WhatsApp'
    }

    return `
      <a href="${this.getShareUrl()}" 
         target="_blank" 
         rel="noopener noreferrer" 
         class="share-btn share-${this.platform}">
        <i class="${iconMap[this.platform]}"></i>
        ${labelMap[this.platform]}
      </a>
    `
  }

  getShareUrl() {
    const encodedUrl = encodeURIComponent(this.url)
    const encodedText = encodeURIComponent(this.text)
    const encodedTags = encodeURIComponent(this.hashtags)

    switch (this.platform) {
      case 'twitter':
        return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}&hashtags=${encodedTags}`
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
      case 'whatsapp':
        return `https://wa.me/?text=${encodedText}%20${encodedUrl}`
      case 'discord':
        // Discord doesn't have a direct share URL, usually just copies link
        return '#'
      default:
        return '#'
    }
  }
}
