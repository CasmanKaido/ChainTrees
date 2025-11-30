            <span style="color:#94a3b8">Sort by:</span>
            <select class="filter-select" id="market-sort">
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div >

  <div class="filter-group">
    <span style="color:#94a3b8">Species:</span>
    <select class="filter-select" id="market-species">
      <option value="">All Species</option>
      <option value="Oak">Oak</option>
      <option value="Pine">Pine</option>
      <option value="Maple">Maple</option>
      <option value="Birch">Birch</option>
    </select>
  </div>
document.getElementById('market-species').addEventListener('change', (e) => {
  this.grid.updateFilters({ species: e.target.value });
});

// Global buy handler
window.buyListing = async (listingId) => {
  if (confirm('Confirm purchase? This will deduct ETH from your wallet.')) {
    try {
      // Mock buyer address
      await marketplaceService.buyListing(listingId, '0xUserWallet');
      alert('Purchase successful! 🌳');
      this.grid.render(); // Refresh grid
    } catch (e) {
      alert(e.message);
    }
  }
};

// Global bid handler
window.placeBid = async (auctionId) => {
  const input = document.getElementById(`bid - input - ${auctionId} `);
  const amount = input.value;

  if (!amount) return alert('Enter bid amount');

  try {
    await auctionSystem.placeBid(auctionId, amount, '0xUserWallet');
    alert('Bid placed successfully! 🔥');
    this.auctionGrid.render();
  } catch (e) {
    alert(e.message);
  }
};

// Global create handler (placeholder)
window.openCreateListing = () => {
  alert('Select a tree from "My Forest" to list it for sale.');
  // Logic to open modal would go here
};
    }
}
