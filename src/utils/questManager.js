import { QUEST_TEMPLATES } from './questData.js';

export class QuestManager {
    constructor() {
        this.storageKey = 'chaintrees_quests';
        this.activeQuests = [];
        this.loadQuests();
    }

    loadQuests() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            this.activeQuests = JSON.parse(stored);
        } else {
            // Initialize with some default quests
            this.activeQuests = QUEST_TEMPLATES.map(template => ({
                ...template,
                progress: 0,
                completed: false,
                claimed: false,
                startDate: new Date().toISOString()
            }));
            this.saveQuests();
        }
    }

    saveQuests() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.activeQuests));
    }

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
        });

        if (updated) this.saveQuests();
    }

    getQuests(type = null) {
        if (!type) return this.activeQuests;
        return this.activeQuests.filter(q => q.type === type);
    }

    claimReward(questId) {
        const quest = this.activeQuests.find(q => q.id === questId);
        if (!quest || !quest.completed || quest.claimed) {
            throw new Error('Cannot claim reward');
        }

        quest.claimed = true;
        this.saveQuests();
        return quest.reward;
    }
}

export const questManager = new QuestManager();
