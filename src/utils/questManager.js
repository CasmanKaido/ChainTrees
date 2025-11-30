/**
 * Update progress for a specific action
 * @param {string} actionType Action identifier (e.g., 'MINT_TREE')
 * @param {number} amount Amount to increment (default 1)
 */
trackAction(actionType, amount = 1) {
  let updated = false;

  this.activeQuests.forEach(quest => {
    if (!quest.completed && quest.action === actionType) {
      quest.progress += amount;

      if (quest.progress >= quest.target) {
        quest.progress = quest.target;
        quest.completed = true;
        // Trigger notification here in future
        console.log(`Quest Completed: ${quest.title}`);
      }
      updated = true;
    }
    ```javascript
/**
 * Update progress for a specific action
 * @param {string} actionType Action identifier (e.g., 'MINT_TREE')
 * @param {number} amount Amount to increment (default 1)
 */
trackAction(actionType, amount = 1) {
    let updated = false;

    this.activeQuests.forEach(quest => {
        if (!quest.completed && quest.action === actionType) {
            quest.progress += amount;

            if (quest.progress >= quest.target) {
                quest.progress = quest.target;
                quest.completed = true;
                // Trigger notification here in future
                console.log(`Quest Completed: ${ quest.title } `);
            }
            updated = true;
        }
    });

    if (updated) this.saveQuests();
}

checkExpiration() {
    const now = new Date();
    let updated = false;

    // Check Daily
    const dailyExpired = this.activeQuests.some(q => 
      q.type === 'daily' && new Date(q.expiresAt) < now
    );

    if (dailyExpired) {
      this.activeQuests = this.activeQuests.filter(q => q.type !== 'daily');
      const newDailies = questGenerator.generateDailyQuests(3);
      this.activeQuests.push(...newDailies);
      updated = true;
    }

    // Check Weekly
    const weeklyExpired = this.activeQuests.some(q => 
      q.type === 'weekly' && new Date(q.expiresAt) < now
    );

    if (weeklyExpired) {
      this.activeQuests = this.activeQuests.filter(q => q.type !== 'weekly');
      const newWeeklies = questGenerator.generateWeeklyQuests(1);
      this.activeQuests.push(...newWeeklies);
      updated = true;
    }

    // Initial Load Check (if empty)
    if (!this.activeQuests.some(q => q.type === 'weekly')) {
       const newWeeklies = questGenerator.generateWeeklyQuests(1);
       this.activeQuests.push(...newWeeklies);
       updated = true;
    }

    if (updated) this.saveQuests();
  }

  refreshDailyQuests() {
    const newDailies = questGenerator.generateDailyQuests(3);
    const newWeeklies = questGenerator.generateWeeklyQuests(1);
    this.activeQuests = [...this.activeQuests, ...newDailies, ...newWeeklies];
    this.saveQuests();
  }  
```javascript
    /**
     * Update progress for a specific action
     * @param {string} actionType Action identifier (e.g., 'MINT_TREE')
     * @param {number} amount Amount to increment (default 1)
     */
    trackAction(actionType, amount = 1) {
      let updated = false;

      this.activeQuests.forEach(quest => {
        if (!quest.completed && quest.action === actionType) {
          quest.progress += amount;

          if (quest.progress >= quest.target) {
            quest.progress = quest.target;
            quest.completed = true;
            // Trigger notification here in future
            console.log(`Quest Completed: ${quest.title} `);
          }
          updated = true;
        }
      });

      if (updated) this.saveQuests();
    }

    checkExpiration() {
      const now = new Date();
      let updated = false;

      // Check Daily
      const dailyExpired = this.activeQuests.some(q =>
        q.type === 'daily' && new Date(q.expiresAt) < now
      );

      if (dailyExpired) {
        this.activeQuests = this.activeQuests.filter(q => q.type !== 'daily');
        const newDailies = questGenerator.generateDailyQuests(3);
        this.activeQuests.push(...newDailies);
        updated = true;
      }

      // Check Weekly
      const weeklyExpired = this.activeQuests.some(q =>
        q.type === 'weekly' && new Date(q.expiresAt) < now
      );

      if (weeklyExpired) {
        this.activeQuests = this.activeQuests.filter(q => q.type !== 'weekly');
        const newWeeklies = questGenerator.generateWeeklyQuests(1);
        this.activeQuests.push(...newWeeklies);
        updated = true;
      }

      // Initial Load Check (if empty)
      if (!this.activeQuests.some(q => q.type === 'weekly')) {
        const newWeeklies = questGenerator.generateWeeklyQuests(1);
        this.activeQuests.push(...newWeeklies);
        updated = true;
      }

      if (updated) this.saveQuests();
    }

    refreshDailyQuests() {
      const newDailies = questGenerator.generateDailyQuests(3);
      const newWeeklies = questGenerator.generateWeeklyQuests(1);
      this.activeQuests = [...this.activeQuests, ...newDailies, ...newWeeklies];
      this.saveQuests();
    }

    getQuests(type = null) {
      if (!type) return this.activeQuests;
      return this.activeQuests.filter(q => q.type === type);
    }

    import { levelingSystem } from './levelingSystem.js';

    // ... (inside class)

    claimReward(questId) {
      const quest = this.activeQuests.find(q => q.id === questId);
      if (!quest || !quest.completed || quest.claimed) {
        throw new Error('Cannot claim reward');
      }

      quest.claimed = true;
      this.saveQuests();

      // Add XP
      if (quest.reward && quest.reward.xp) {
        levelingSystem.addXP(quest.reward.xp);
      }

      return quest.reward;
    }
  }

export const questManager = new QuestManager();
  ```
