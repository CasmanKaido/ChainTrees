import { QUEST_TEMPLATES, QUEST_TYPES } from './questData.js';

export class QuestGenerator {
    /**
     * Generate a set of daily quests
     * @param {number} count Number of quests to generate
     * @returns {Array} List of quest objects
     */
    generateDailyQuests(count = 3) {
        const dailyTemplates = QUEST_TEMPLATES.filter(t => t.type === QUEST_TYPES.DAILY);
        const shuffled = dailyTemplates.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, count);

        return selected.map(template => ({
            ...template,
            instanceId: `daily_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            progress: 0,
            completed: false,
            claimed: false,
            startDate: new Date().toISOString(),
            expiresAt: this.getEndOfDay().toISOString()
        }));
    }

    /**
     * Get date object for end of current day
     */
    getEndOfDay() {
        const date = new Date();
        date.setHours(23, 59, 59, 999);
        return date;
    }
}

export const questGenerator = new QuestGenerator();
