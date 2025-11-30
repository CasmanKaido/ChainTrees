import { socialShareSystem } from '../utils/socialShareSystem.js';

export class ShareModal {
    constructor() {
        this.createModal();
        this.shareData = null;
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'gift-modal'; // Reuse modal styles
        modal.id = 'share-modal';

        modal.innerHTML = `
      <div class="gift-content">
        <h2>📢 Share to World</h2>
        <p style="color:#94a3b8; margin-bottom:1.5rem">Show off your impact and invite friends!</p>
        
        <div class="share-preview" style="background:rgba(255,255,255,0.05); padding:1rem; border-radius:8px; margin-bottom:1.5rem; font-style:italic; color:#e2e8f0">
          "<span id="share-text-preview">...</span>"
        </div>

        <div class="share-buttons" style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:1rem">
          <button class="share-btn twitter" style="background:#1DA1F2; border:none; padding:0.75rem; border-radius:8px; color:white; cursor:pointer; font-weight:bold">
            Twitter
          </button>
          <button class="share-btn facebook" style="background:#4267B2; border:none; padding:0.75rem; border-radius:8px; color:white; cursor:pointer; font-weight:bold">
            Facebook
          </button>
          <button class="share-btn telegram" style="background:#0088cc; border:none; padding:0.75rem; border-radius:8px; color:white; cursor:pointer; font-weight:bold">
            Telegram
          </button>
        </div>

        <button class="close-install-btn" id="close-share-btn" style="margin-top:1.5rem; width:100%">Close</button>
      </div>
    `;

        document.body.appendChild(modal);

        // Listeners
        modal.querySelector('.twitter').addEventListener('click', () => this.handleShare('twitter'));
        modal.querySelector('.facebook').addEventListener('click', () => this.handleShare('facebook'));
        modal.querySelector('.telegram').addEventListener('click', () => this.handleShare('telegram'));
        modal.querySelector('#close-share-btn').addEventListener('click', () => this.close());
    }

    open(type, data) {
        const text = socialShareSystem.generateShareText(type, data);
        this.shareData = { text };

        document.getElementById('share-text-preview').textContent = text;
        document.getElementById('share-modal').classList.add('active');
    }

    close() {
        document.getElementById('share-modal').classList.remove('active');
    }

    handleShare(platform) {
        if (this.shareData) {
            socialShareSystem.share(platform, this.shareData.text);
            this.close();
        }
    }
}
