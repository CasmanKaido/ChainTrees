import { transactionHistory } from '../utils/transactionHistory.js';

export class UserTransactions {
    constructor(containerId) {
        this.containerId = containerId;
    }

    render(userAddress) {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const history = transactionHistory.getHistory(userAddress);

        if (history.length === 0) {
            container.innerHTML = `<div style="text-align:center; color:#64748b; padding:1rem;">No transaction history</div>`;
            return;
        }

        container.innerHTML = `
      <div style="background:rgba(255,255,255,0.03); border-radius:12px; overflow:hidden;">
        <table style="width:100%; border-collapse:collapse; color:#e2e8f0; font-size:0.9rem;">
          <thead>
            <tr style="background:rgba(0,0,0,0.2); text-align:left;">
              <th style="padding:1rem;">Event</th>
              <th style="padding:1rem;">Item</th>
              <th style="padding:1rem;">Price</th>
              <th style="padding:1rem;">From</th>
              <th style="padding:1rem;">To</th>
              <th style="padding:1rem;">Date</th>
            </tr>
          </thead>
          <tbody>
            ${history.map(tx => `
              <tr style="border-top:1px solid rgba(255,255,255,0.05);">
                <td style="padding:1rem;">
                  <span style="background:rgba(59,130,246,0.1); color:#3b82f6; padding:0.25rem 0.5rem; border-radius:4px; font-size:0.8rem;">
                    ${tx.type}
                  </span>
                </td>
                <td style="padding:1rem;">${tx.item.species} #${tx.item.id}</td>
                <td style="padding:1rem; font-weight:bold;">${tx.price} ETH</td>
                <td style="padding:1rem; color:#94a3b8;">${tx.from.substr(0, 6)}...</td>
                <td style="padding:1rem; color:#94a3b8;">${tx.to.substr(0, 6)}...</td>
                <td style="padding:1rem; color:#64748b;">${new Date(tx.timestamp).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    }
}
