export class DateRangePicker {
    constructor(onRangeChange) {
        this.onRangeChange = onRangeChange;
        this.currentRange = '30d';
    }

    render() {
        return `
      <div class="date-picker-container">
        <select id="date-range-select" class="date-picker">
          <option value="7d">Last 7 Days</option>
          <option value="30d" selected>Last 30 Days</option>
          <option value="90d">Last 3 Months</option>
          <option value="1y">Last Year</option>
          <option value="all">All Time</option>
        </select>
      </div>
    `;
    }

    attachListeners(container) {
        const select = container.querySelector('#date-range-select');
        if (select) {
            select.addEventListener('change', (e) => {
                this.currentRange = e.target.value;
                this.onRangeChange(this.currentRange);
            });
        }
    }
}
