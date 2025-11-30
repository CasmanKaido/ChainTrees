export class ArticleCard {
    constructor(article, onStartQuiz) {
        this.article = article;
        this.onStartQuiz = onStartQuiz;
    }

    render() {
        const { id, title, description, reward, isCompleted, image } = this.article;

        return `
      <div class="article-card">
        <div class="article-image" style="background-image: url('${image || 'https://via.placeholder.com/300x180'}')">
          <div class="article-badge">+${reward} TREE</div>
        </div>
        
        <div class="article-content">
          <h3 class="article-title">${title}</h3>
          <p class="article-desc">${description}</p>
          
          ${isCompleted ? `
            <button class="quiz-btn completed" disabled>
              <i class="fas fa-check-circle"></i> Completed
            </button>
          ` : `
            <button class="quiz-btn" data-id="${id}">
              <i class="fas fa-graduation-cap"></i> Take Quiz
            </button>
          `}
        </div>
      </div>
    `;
    }

    attachListeners(container) {
        const btn = container.querySelector(`.quiz-btn[data-id="${this.article.id}"]`);
        if (btn) {
            btn.addEventListener('click', () => this.onStartQuiz(this.article));
        }
    }
}
