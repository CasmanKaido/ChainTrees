import { ShareButton } from './ShareButton.js';
import { referralSystem } from '../utils/referralSystem.js';
import '../styles/social.css';

export class SocialShareSection {
    constructor(containerId, userAddress) {
        this.containerId = containerId;
        this.userAddress = userAddress;
        this.referralCode = referralSystem.generateCode(userAddress);
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const referralLink = referralSystem.getReferralLink(this.referralCode);
        const shareText = `I just planted trees on ChainTrees! Use my code ${this.referralCode} to get a bonus starter pack! 🌳`;

        container.innerHTML = `
      <div class="social-section">
        <div class="social-header">
          <h2>Grow Together 🤝</h2>
          <p>Invite friends and earn 50 TREE tokens for every new planter!</p>
        </div>

        <div class="referral-card">
          <h3>Your Referral Code</h3>
          <div class="referral-code-container">
            <span class="referral-code">${this.referralCode}</span>
            <button class="copy-btn" id="copy-ref-btn" title="Copy Link">
              <i class="fas fa-copy"></i>
            </button>
          </div>
          <p class="text-sm text-secondary">Share this link to earn rewards</p>
        </div>

        <div class="share-buttons">
          ${new ShareButton({ platform: 'twitter', text: shareText, url: referralLink }).render()}
          ${new ShareButton({ platform: 'facebook', url: referralLink }).render()}
          ${new ShareButton({ platform: 'whatsapp', text: shareText, url: referralLink }).render()}
        </div>
      </div>
    `;

        this.attachListeners(referralLink);
    }

    attachListeners(link) {
        const copyBtn = document.getElementById('copy-ref-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(link);

                // Visual feedback
                const originalIcon = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                copyBtn.style.color = '#4ade80';

                setTimeout(() => {
                    copyBtn.innerHTML = originalIcon;
                    copyBtn.style.color = '';
                }, 2000);
            });
        }
    }
}
