import { APYCalculator } from './APYCalculator.js';

export class StakeInterface {
    constructor(containerId, onStake) {
        this.containerId = containerId;
        this.onStake = onStake;
        this.state = {
            amount: '',
            lockPeriod: 30
        };
        this.calculator = null;
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = `
      <div class="staking-interface">
        <div class="stake-panel">
          <div class="panel-header">
            <span class="panel-title">Stake TREE</span>
            <span class="balance-display">Balance: 1,250.00 TREE</span>
          </div>

          <div class="input-group">
            <div class="amount-input-container">
              <input type="number" id="stake-amount" class="amount-input" placeholder="0.00" value="${this.state.amount}">
              <span style="font-weight: bold; margin-left: 0.5rem;">TREE</span>
              <button class="max-btn" id="max-stake-btn">MAX</button>
            </div>
          </div>

          <div class="lock-period-selector">
            <button class="period-btn" data-days="0">Flex</button>
            <button class="period-btn active" data-days="30">30d</button>
            <button class="period-btn" data-days="90">90d</button>
            <button class="period-btn" data-days="365">365d</button>
          </div>

          <button class="action-btn btn-stake" id="confirm-stake-btn">
            Stake Tokens
          </button>
        </div>

        <div id="apy-calculator-container"></div>
      </div>
    `;

        this.calculator = new APYCalculator('apy-calculator-container');
        this.updateCalculator();
        this.attachListeners();
    }

    attachListeners() {
        // Amount Input
        const input = document.getElementById('stake-amount');
        input.addEventListener('input', (e) => {
            this.state.amount = e.target.value;
            this.updateCalculator();
        });

        // Max Button
        document.getElementById('max-stake-btn').addEventListener('click', () => {
            this.state.amount = '1250'; // Mock balance
            input.value = this.state.amount;
            this.updateCalculator();
        });

        // Period Selectors
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.state.lockPeriod = parseInt(btn.dataset.days);
                this.updateCalculator();
            });
        });

        // Stake Button
        document.getElementById('confirm-stake-btn').addEventListener('click', () => {
            if (!this.state.amount || parseFloat(this.state.amount) <= 0) {
                alert('Please enter a valid amount');
                return;
            }
            this.onStake(this.state);
        });
    }

    updateCalculator() {
        if (this.calculator) {
            this.calculator.render(this.state.amount, this.state.lockPeriod);
        }
    }
}
