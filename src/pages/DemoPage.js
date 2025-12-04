// src/pages/DemoPage.js
import { LoadingSkeleton } from '../components/LoadingSkeleton.js';
import { RarityBadge } from '../components/RarityBadge.js';
import { ErrorFallback } from '../components/ErrorFallback.js';

export class DemoPage {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    async render() {
        this.container.innerHTML = `
      <div class="demo-page page-enter">
        <h1>Component Demo</h1>
        
        <section class="demo-section">
          <h2>Loading Skeleton</h2>
          <div id="skeleton-demo" class="demo-box"></div>
        </section>

        <section class="demo-section">
          <h2>Rarity Badge</h2>
          <div id="badge-demo" class="demo-box"></div>
        </section>

        <section class="demo-section">
          <h2>Micro-Animations</h2>
          <div class="demo-box">
            <button class="btn-hover-effect" style="padding:10px 20px; border:none; background:#4caf50; color:white; border-radius:5px;">Hover Me</button>
            <div class="spinner-pulse" style="width:40px; height:40px; background:#4caf50; border-radius:50%; margin-top:10px;"></div>
          </div>
        </section>

        <section class="demo-section">
          <h2>Error Fallback</h2>
          <div id="error-demo" class="demo-box"></div>
        </section>
      </div>
    `;

        // Render Skeleton
        new LoadingSkeleton(this.container.querySelector('#skeleton-demo'), 3).render();

        // Render Badge
        new RarityBadge(this.container.querySelector('#badge-demo'), [
            { trait_type: 'Species', rarity: 'legendary' },
            { trait_type: 'Effect', rarity: 'epic' }
        ]).render();

        // Render Error Fallback
        new ErrorFallback(
            this.container.querySelector('#error-demo'),
            new Error('This is a demo error state'),
            () => alert('Retry clicked!')
        ).render();
    }
}
