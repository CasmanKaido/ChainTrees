import { ArticleCard } from '../components/ArticleCard.js';
import { QuizModal } from '../components/QuizModal.js';
import { walletState } from '../utils/walletState.js';
import '../styles/education.css';

export class EducationPage {
    constructor(containerId) {
        this.containerId = containerId;
        this.articles = [];
        this.quizModal = new QuizModal((id) => this.handleQuizComplete(id));
    }

    async render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        // Mock data
        this.articles = [
            {
                id: 1,
                title: 'Carbon Offsetting 101',
                description: 'Learn the basics of carbon credits and how trees help fight climate change.',
                image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=500&q=60',
                reward: 50,
                isCompleted: false,
                question: 'What is the primary gas that trees absorb from the atmosphere?',
                options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Methane'],
                correctAnswer: 1
            },
            {
                id: 2,
                title: 'Web3 & Sustainability',
                description: 'Discover how blockchain technology is revolutionizing environmental transparency.',
                image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=500&q=60',
                reward: 75,
                isCompleted: false,
                question: 'How does blockchain help in environmental projects?',
                options: ['It uses more energy', 'It provides transparent tracking', 'It prints paper money', 'It cuts down trees'],
                correctAnswer: 1
            },
            {
                id: 3,
                title: 'Tree Care Guide',
                description: 'Master the art of virtual forestry and maximize your tree growth rates.',
                image: 'https://images.unsplash.com/photo-1458966480358-a0ac42de0a7a?auto=format&fit=crop&w=500&q=60',
                reward: 30,
                isCompleted: true, // Mock completed
                question: 'How often should you water your virtual tree?',
                options: ['Every hour', 'Once a week', 'Every 24 hours', 'Never'],
                correctAnswer: 2
            }
        ];

        container.innerHTML = `
      <div class="education-page">
        <div class="education-header">
          <h1 class="education-title">Learn to Earn</h1>
          <p style="color: var(--text-secondary)">Expand your knowledge and earn TREE tokens</p>
        </div>

        <div id="content-grid" class="content-grid">
          <!-- Articles injected here -->
        </div>
      </div>
    `;

        this.renderArticles();
    }

    renderArticles() {
        const grid = document.getElementById('content-grid');
        if (!grid) return;

        grid.innerHTML = this.articles.map(article => {
            const component = new ArticleCard(article, (item) => this.startQuiz(item));
            return component.render();
        }).join('');

        this.articles.forEach(article => {
            const component = new ArticleCard(article, (item) => this.startQuiz(item));
            component.attachListeners(grid);
        });
    }

    startQuiz(article) {
        const account = walletState.getAccount();
        if (!account.isConnected) {
            alert('Please connect your wallet to take quizzes');
            return;
        }
        this.quizModal.open(article);
    }

    async handleQuizComplete(id) {
        try {
            // await contractService.claimQuizReward(id);
            alert('Reward claimed successfully! (Mock)');

            // Update local state
            const article = this.articles.find(a => a.id === id);
            if (article) {
                article.isCompleted = true;
                this.renderArticles();
            }
        } catch (error) {
            alert('Failed to claim reward: ' + error.message);
        }
    }
}
