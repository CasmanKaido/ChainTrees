export class QuizModal {
  constructor(onComplete) {
    this.onComplete = onComplete
    this.currentQuiz = null
    this.isOpen = false
  }

  render() {
    if (!document.getElementById('quiz-modal')) {
      const modal = document.createElement('div')
      modal.id = 'quiz-modal'
      modal.className = 'modal-overlay'
      document.body.appendChild(modal)
    }

    const modal = document.getElementById('quiz-modal')
    // Content is dynamic based on open() call
    this.attachListeners(modal)
  }

  open(article) {
    this.currentQuiz = article
    const modal = document.getElementById('quiz-modal')

    modal.innerHTML = `
      <div class="modal-content quiz-content">
        <div class="modal-header">
          <h2>${article.title} Quiz</h2>
          <button class="close-modal">&times;</button>
        </div>
        
        <div class="quiz-question">${article.question}</div>
        
        <div class="quiz-options">
          ${article.options
            .map(
              (opt, idx) => `
            <div class="quiz-option" data-idx="${idx}">${opt}</div>
          `
            )
            .join('')}
        </div>
        
        <div id="quiz-feedback" class="quiz-feedback"></div>
        
        <button class="buy-btn" id="submit-quiz-btn" disabled>Submit Answer</button>
      </div>
    `

    modal.classList.add('open')
    this.isOpen = true
    this.attachQuizListeners(modal)
  }

  close() {
    const modal = document.getElementById('quiz-modal')
    if (modal) {
      modal.classList.remove('open')
      this.isOpen = false
    }
  }

  attachListeners(modal) {
    // Global listeners (close on outside click)
    modal.addEventListener('click', e => {
      if (e.target === modal) this.close()
    })
  }

  attachQuizListeners(modal) {
    modal.querySelector('.close-modal').addEventListener('click', () => this.close())

    const options = modal.querySelectorAll('.quiz-option')
    const submitBtn = modal.querySelector('#submit-quiz-btn')
    let selectedIdx = null

    options.forEach(opt => {
      opt.addEventListener('click', () => {
        options.forEach(o => o.classList.remove('selected'))
        opt.classList.add('selected')
        selectedIdx = parseInt(opt.dataset.idx)
        submitBtn.disabled = false
      })
    })

    submitBtn.addEventListener('click', () => {
      const isCorrect = selectedIdx === this.currentQuiz.correctAnswer
      const feedback = modal.querySelector('#quiz-feedback')

      options.forEach(o => {
        const idx = parseInt(o.dataset.idx)
        if (idx === this.currentQuiz.correctAnswer) o.classList.add('correct')
        else if (idx === selectedIdx) o.classList.add('wrong')
      })

      if (isCorrect) {
        feedback.className = 'quiz-feedback show feedback-success'
        feedback.textContent = `Correct! You earned ${this.currentQuiz.reward} TREE tokens!`
        submitBtn.style.display = 'none'
        setTimeout(() => {
          this.onComplete(this.currentQuiz.id)
          this.close()
        }, 2000)
      } else {
        feedback.className = 'quiz-feedback show feedback-error'
        feedback.textContent = 'Incorrect. Try again!'
      }
    })
  }
}
