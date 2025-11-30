export class InstallPrompt {
    constructor() {
        this.deferredPrompt = null;
    }

    init() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showPrompt();
        });
    }

    showPrompt() {
        // Check if already dismissed
        if (localStorage.getItem('install_dismissed')) return;

        const prompt = document.createElement('div');
        prompt.className = 'install-prompt';
        prompt.innerHTML = `
      <div class="install-text">
        <div class="install-title">Install ChainTrees</div>
        <div class="install-desc">Add to home screen for the best experience</div>
      </div>
      <div class="install-actions">
        <button class="install-btn">Install</button>
        <button class="close-install-btn"><i class="fas fa-times"></i></button>
      </div>
    `;

        document.body.appendChild(prompt);

        // Animate in
        setTimeout(() => prompt.classList.add('show'), 100);

        // Listeners
        prompt.querySelector('.install-btn').addEventListener('click', () => {
            this.deferredPrompt.prompt();
            this.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                }
                this.deferredPrompt = null;
                prompt.remove();
            });
        });

        prompt.querySelector('.close-install-btn').addEventListener('click', () => {
            prompt.classList.remove('show');
            setTimeout(() => prompt.remove(), 300);
            localStorage.setItem('install_dismissed', 'true');
        });
    }
}
