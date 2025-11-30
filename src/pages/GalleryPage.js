import { TreeCard } from '../components/TreeCard.js';
import { FilterControls } from '../components/FilterControls.js';
import { TreeDetailModal } from '../components/TreeDetailModal.js';
import '../styles/gallery.css';

export class GalleryPage {
    constructor(containerId) {
        this.containerId = containerId;
        this.trees = []; // Will store fetched trees
        this.filteredTrees = [];
        this.currentFilters = {
            search: '',
            species: 'all',
            stage: 'all',
            sort: 'newest',
            view: 'grid'
        };
    }

    async render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = `
      <div class="gallery-page">
        <div class="gallery-header">
          <h1>Global Tree Gallery</h1>
          <p>Explore the ChainTrees ecosystem and discover unique species from around the world.</p>
        </div>

        <div id="gallery-controls"></div>
        
        <div id="gallery-content" class="gallery-grid">
          <div class="gallery-loading">
            <div class="spinner"></div>
            <p>Loading trees from blockchain...</p>
          </div>
        </div>
      </div>
    `;

        // Initialize controls
        this.controls = new FilterControls('gallery-controls', (filters) => {
            this.currentFilters = filters;
            this.applyFilters();
        });
        this.controls.render();

        // Fetch data
        await this.fetchTrees();
    }

    async fetchTrees() {
        try {
            // TODO: Replace with actual contract call
            // Mock data for now to demonstrate UI
            this.trees = this.generateMockTrees(50);

            this.applyFilters();
        } catch (error) {
            console.error('Error fetching trees:', error);
            document.getElementById('gallery-content').innerHTML = `
        <div class="gallery-empty">
          <h3>Error Loading Gallery</h3>
          <p>Please try again later.</p>
        </div>
      `;
        }
    }

    generateMockTrees(count) {
        const speciesList = ['Oak', 'Maple', 'Pine', 'Birch', 'Willow', 'Cherry', 'Redwood', 'Sequoia', 'Spruce', 'Cedar'];
        const stages = ['Sapling', 'Young', 'Mature', 'Ancient'];

        return Array.from({ length: count }, (_, i) => ({
            id: i + 1,
            species: speciesList[Math.floor(Math.random() * speciesList.length)],
            stage: stages[Math.floor(Math.random() * stages.length)],
            carbonOffset: Math.floor(Math.random() * 50000) + 1000,
            waterCount: Math.floor(Math.random() * 100),
            image: `https://raw.githubusercontent.com/CasmanKaido/ChainTrees/main/docs/assets/tree-placeholder.png` // Placeholder
        }));
    }

    applyFilters() {
        const { search, species, stage, sort, view } = this.currentFilters;

        // Filter
        this.filteredTrees = this.trees.filter(tree => {
            const matchesSearch = tree.species.toLowerCase().includes(search.toLowerCase()) ||
                tree.id.toString().includes(search);
            const matchesSpecies = species === 'all' || tree.species === species;
            const matchesStage = stage === 'all' || tree.stage === stage;

            return matchesSearch && matchesSpecies && matchesStage;
        });

        // Sort
        this.filteredTrees.sort((a, b) => {
            if (sort === 'newest') return b.id - a.id;
            if (sort === 'oldest') return a.id - b.id;
            if (sort === 'carbon-high') return b.carbonOffset - a.carbonOffset;
            if (sort === 'water-high') return b.waterCount - a.waterCount;
            return 0;
        });

        this.renderGrid(view);
    }

    renderGrid(viewMode) {
        const grid = document.getElementById('gallery-content');
        if (!grid) return;

        // Update view class
        if (viewMode === 'list') {
            grid.classList.add('list-view');
        } else {
            grid.classList.remove('list-view');
        }

        if (this.filteredTrees.length === 0) {
            grid.innerHTML = `
        <div class="gallery-empty">
          <h3>No Trees Found</h3>
          <p>Try adjusting your filters to see more results.</p>
        </div>
      `;
            return;
        }
        import { TreeCard } from '../components/TreeCard.js';
        import { FilterControls } from '../components/FilterControls.js';
        import { TreeDetailModal } from '../components/TreeDetailModal.js';
        import '../styles/gallery.css';

        export class GalleryPage {
            constructor(containerId) {
                this.containerId = containerId;
                this.trees = []; // Will store fetched trees
                this.filteredTrees = [];
                this.currentFilters = {
                    search: '',
                    species: 'all',
                    stage: 'all',
                    sort: 'newest',
                    view: 'grid'
                };
            }

            async render() {
                const container = document.getElementById(this.containerId);
                if (!container) return;

                container.innerHTML = `
      <div class="gallery-page">
        <div class="gallery-header">
          <h1>Global Tree Gallery</h1>
          <p>Explore the ChainTrees ecosystem and discover unique species from around the world.</p>
        </div>

        <div id="gallery-controls"></div>
        
        <div id="gallery-content" class="gallery-grid">
          <div class="gallery-loading">
            <div class="spinner"></div>
            <p>Loading trees from blockchain...</p>
          </div>
        </div>
      </div>
    `;

                // Initialize controls
                this.controls = new FilterControls('gallery-controls', (filters) => {
                    this.currentFilters = filters;
                    this.applyFilters();
                });
                this.controls.render();

                // Fetch data
                await this.fetchTrees();
            }

            async fetchTrees() {
                try {
                    // TODO: Replace with actual contract call
                    // Mock data for now to demonstrate UI
                    this.trees = this.generateMockTrees(50);

                    this.applyFilters();
                } catch (error) {
                    console.error('Error fetching trees:', error);
                    document.getElementById('gallery-content').innerHTML = `
        <div class="gallery-empty">
          <h3>Error Loading Gallery</h3>
          <p>Please try again later.</p>
        </div>
      `;
                }
            }

            generateMockTrees(count) {
                const speciesList = ['Oak', 'Maple', 'Pine', 'Birch', 'Willow', 'Cherry', 'Redwood', 'Sequoia', 'Spruce', 'Cedar'];
                const stages = ['Sapling', 'Young', 'Mature', 'Ancient'];

                return Array.from({ length: count }, (_, i) => ({
                    id: i + 1,
                    species: speciesList[Math.floor(Math.random() * speciesList.length)],
                    stage: stages[Math.floor(Math.random() * stages.length)],
                    carbonOffset: Math.floor(Math.random() * 50000) + 1000,
                    waterCount: Math.floor(Math.random() * 100),
                    image: `https://raw.githubusercontent.com/CasmanKaido/ChainTrees/main/docs/assets/tree-placeholder.png` // Placeholder
                }));
            }

            applyFilters() {
                const { search, species, stage, sort, view } = this.currentFilters;

                // Filter
                this.filteredTrees = this.trees.filter(tree => {
                    const matchesSearch = tree.species.toLowerCase().includes(search.toLowerCase()) ||
                        tree.id.toString().includes(search);
                    const matchesSpecies = species === 'all' || tree.species === species;
                    const matchesStage = stage === 'all' || tree.stage === stage;

                    return matchesSearch && matchesSpecies && matchesStage;
                });

                // Sort
                this.filteredTrees.sort((a, b) => {
                    if (sort === 'newest') return b.id - a.id;
                    if (sort === 'oldest') return a.id - b.id;
                    if (sort === 'carbon-high') return b.carbonOffset - a.carbonOffset;
                    if (sort === 'water-high') return b.waterCount - a.waterCount;
                    return 0;
                });

                this.renderGrid(view);
            }

            renderGrid(viewMode) {
                const grid = document.getElementById('gallery-content');
                if (!grid) return;

                // Update view class
                if (viewMode === 'list') {
                    grid.classList.add('list-view');
                } else {
                    grid.classList.remove('list-view');
                }

                if (this.filteredTrees.length === 0) {
                    grid.innerHTML = `
        <div class="gallery-empty">
          <h3>No Trees Found</h3>
          <p>Try adjusting your filters to see more results.</p>
        </div>
      `;
                    return;
                }

                grid.innerHTML = this.filteredTrees
                    .map(tree => new TreeCard(tree).render())
                    .join('');

                // Add click listeners to cards
                document.querySelectorAll('.tree-card').forEach(card => {
                    card.addEventListener('click', () => {
                        const id = card.dataset.id;
                        const tree = this.trees.find(t => t.id == id);
                        if (tree) {
                            const modal = new TreeDetailModal();
                            modal.render(tree);
                        }
                    });
                });
            }
        }
