# API Documentation

## Overview

ChainTrees uses a combination of blockchain interactions and local state management. This document outlines the key APIs and utilities available.

## Core Utilities

### WalletConnect

```javascript
import { walletState } from './utils/walletState.js';

// Connect wallet
await walletState.connect();

// Get current account
const account = walletState.getAccount();

// Disconnect
await walletState.disconnect();
```

### Marketplace Service

```javascript
import { marketplaceService } from './services/marketplaceService.js';

// Create listing
marketplaceService.createListing(treeId, price, seller);

// Buy listing
await marketplaceService.buyListing(listingId, buyer);

// Get all listings
const listings = marketplaceService.getListings();
```

### Governance System

```javascript
import { governanceSystem } from './utils/governanceSystem.js';

// Create proposal
const proposalId = governanceSystem.createProposal(
  title,
  description,
  creator,
  durationDays
);

// Vote on proposal
governanceSystem.vote(proposalId, voterAddress, 'FOR', votingPower);

// Execute proposal
governanceSystem.executeProposal(proposalId);
```

### Token System

```javascript
import { tokenSystem } from './utils/tokenSystem.js';

// Get balance
const balance = tokenSystem.balanceOf(address);

// Get voting power
const votes = tokenSystem.getVotes(address);

// Delegate votes
tokenSystem.delegate(delegator, delegatee);
```

## Notification System

```javascript
import { notificationSystem } from './utils/notificationSystem.js';

// Show success notification
notificationSystem.success('Transaction completed!');

// Show error
notificationSystem.error('Something went wrong', 'Error');

// Custom notification
notificationSystem.show('Custom message', {
  type: 'info',
  duration: 5000,
  action: {
    label: 'View',
    callback: () => console.log('Clicked')
  }
});
```

## Theme Manager

```javascript
import { themeManager } from './utils/themeManager.js';

// Apply theme
themeManager.applyTheme('dark'); // 'dark', 'light', 'autumn', 'ocean'

// Get current theme
const current = themeManager.getCurrentTheme();

// Toggle dark mode
themeManager.toggleDarkMode();
```

## Analytics Tracker

```javascript
import { analyticsTracker } from './utils/analyticsTracker.js';

// Track page view
analyticsTracker.trackPageView('marketplace');

// Track action
analyticsTracker.trackAction('mint_tree', 'nft', { species: 'Oak' });

// Track conversion
analyticsTracker.trackConversion('purchase', 0.5);
```

## Localization (i18n)

```javascript
import { i18n } from './utils/localizationManager.js';

// Translate text
const text = i18n.t('common.welcome');

// With parameters
const greeting = i18n.t('greeting', { name: 'User' });

// Change language
i18n.setLocale('es'); // 'en', 'es', 'fr'

// Format numbers
const formatted = i18n.formatNumber(1234.56);

// Format currency
const price = i18n.formatCurrency(99.99, 'USD');
```

## Tutorial System

```javascript
import { tutorialSystem } from './utils/tutorialSystem.js';

// Register tutorial
tutorialSystem.register('my-tutorial', [
  {
    title: 'Step 1',
    description: 'Click here',
    element: '.my-button',
    position: 'bottom'
  }
]);

// Start tutorial
tutorialSystem.start('my-tutorial');

// Check if completed
const completed = tutorialSystem.isCompleted('my-tutorial');
```

## Export Manager

```javascript
import { exportManager } from './utils/exportManager.js';

// Export to JSON
exportManager.exportJSON(data, 'filename');

// Export to CSV
exportManager.exportCSV(arrayData, 'filename');

// Create backup
exportManager.createBackup();

// Restore backup
const backup = await exportManager.restoreBackup(file);
```

## Animation Controller

```javascript
import { animationController } from './utils/animationController.js';

// Fade in element
animationController.fadeIn(element, 300);

// Slide in
animationController.slideIn(element, 'left', 300);

// Custom animation
animationController.register('my-anim', (progress) => {
  element.style.opacity = progress;
}, { duration: 1000, easing: 'easeInOut' });
```

## Cache System

```javascript
import { cacheSystem } from './utils/cacheSystem.js';

// Set cache
cacheSystem.set('key', data, 5 * 60 * 1000); // 5 minutes TTL

// Get cache
const cached = cacheSystem.get('key');

// Clear cache
cacheSystem.clear();
```

## Error Handling

```javascript
import { errorBoundary } from './utils/errorBoundary.js';

// Wrap async function
await errorBoundary.wrap(async () => {
  // Your code here
}, 'context description');

// Register error handler
errorBoundary.onError((error) => {
  console.log('Error occurred:', error);
});
```

## Performance Monitoring

```javascript
import { performanceMonitor } from './utils/performanceMonitor.js';

// Track page load
performanceMonitor.trackPageLoad('marketplace');

// Track API call
performanceMonitor.trackApiCall('/api/trees', 150, true);

// Get summary
const summary = performanceMonitor.getSummary();
```

## Events

### Global Events

```javascript
// Theme change
window.addEventListener('themechange', (e) => {
  console.log('New theme:', e.detail.theme);
});

// Locale change
window.addEventListener('localechange', (e) => {
  console.log('New locale:', e.detail.locale);
});

// Wallet connection
window.addEventListener('walletconnected', (e) => {
  console.log('Wallet:', e.detail.address);
});
```

## Best Practices

1. **Always validate user input** using `DataValidator`
2. **Use try-catch** for async operations
3. **Track important actions** with analytics
4. **Cache expensive operations** when possible
5. **Show user feedback** with notifications
6. **Handle errors gracefully** with error boundary

## Rate Limits

- Marketplace listings: No limit (local storage)
- Governance proposals: 1 per hour per user (recommended)
- Analytics events: 100 per minute

## Support

For API questions, create an issue on GitHub or check the source code documentation.

---

**Last Updated**: 2025-11-30
