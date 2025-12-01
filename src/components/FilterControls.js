export class FilterControls {
  constructor(containerId, onFilterChange) {
    this.containerId = containerId
    this.onFilterChange = onFilterChange
    this.state = {
      search: '',
      species: 'all',
      stage: 'all',
      sort: 'newest',
      view: 'grid'
    }
  }

  render() {
    const container = document.getElementById(this.containerId)
    if (!container) return

    container.innerHTML = `
      <div class="filter-controls">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" id="gallery-search" placeholder="Search by ID or Species..." value="${this.state.search}">
        </div>
        
        <div class="filters">
          <select id="species-filter" class="filter-select">
            <option value="all">All Species</option>
            <option value="Oak">Oak</option>
            <option value="Maple">Maple</option>
            <option value="Pine">Pine</option>
            <option value="Birch">Birch</option>
            <option value="Willow">Willow</option>
            <option value="Cherry">Cherry</option>
            <option value="Redwood">Redwood</option>
            <option value="Sequoia">Sequoia</option>
            <option value="Spruce">Spruce</option>
            <option value="Cedar">Cedar</option>
          </select>

          <select id="stage-filter" class="filter-select">
            <option value="all">All Stages</option>
            <option value="Sapling">Sapling</option>
            <option value="Young">Young</option>
            <option value="Mature">Mature</option>
            <option value="Ancient">Ancient</option>
          </select>

          <select id="sort-filter" class="filter-select">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="carbon-high">Highest Carbon</option>
            <option value="water-high">Most Watered</option>
          </select>
        </div>

        <div class="view-toggles">
          <button class="view-btn ${this.state.view === 'grid' ? 'active' : ''}" data-view="grid" title="Grid View">
            <i class="fas fa-th-large"></i> Grid
          </button>
          <button class="view-btn ${this.state.view === 'list' ? 'active' : ''}" data-view="list" title="List View">
            <i class="fas fa-list"></i> List
          </button>
        </div>
      </div>
    `

    this.attachListeners()
  }

  attachListeners() {
    // Search
    document.getElementById('gallery-search').addEventListener('input', e => {
      this.state.search = e.target.value
      this.onFilterChange(this.state)
    })

    // Species Filter
    document.getElementById('species-filter').addEventListener('change', e => {
      this.state.species = e.target.value
      this.onFilterChange(this.state)
    })

    // Stage Filter
    document.getElementById('stage-filter').addEventListener('change', e => {
      this.state.stage = e.target.value
      this.onFilterChange(this.state)
    })

    // Sort
    document.getElementById('sort-filter').addEventListener('change', e => {
      this.state.sort = e.target.value
      this.onFilterChange(this.state)
    })

    // View Toggles
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.view = btn.dataset.view

        // Update UI
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'))
        btn.classList.add('active')

        this.onFilterChange(this.state)
      })
    })
  }
}
