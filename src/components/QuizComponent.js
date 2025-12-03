export function QuizComponent({ questions }) {
    let currentIndex = 0;
    let score = 0;
    const total = questions.length;

    function renderQuestion() {
        const q = questions[currentIndex];
        return `
            <div class="quiz-card">
                <h3 class="quiz-question">${q.question}</h3>
                <ul class="quiz-options">
                    ${q.options.map((opt, i) => `
                        <li>
                            <label>
                                <input type="radio" name="option" value="${i}" />
                                ${opt}
                            </label>
                        </li>
                    `).join('')}
                </ul>
                <button class="quiz-next btn btn-primary" onclick="submitAnswer()">Next</button>
            </div>
        `;
    }

    window.submitAnswer = function () {
        const selected = document.querySelector('input[name="option"]:checked');
        if (!selected) return alert('Please select an answer');
        const answerIndex = parseInt(selected.value, 10);
        if (answerIndex === questions[currentIndex].answer) {
            score++;
        }
        currentIndex++;
        if (currentIndex < total) {
            document.getElementById('quiz-container').innerHTML = renderQuestion();
        } else {
            showResult();
        }
    };

    function showResult() {
        document.getElementById('quiz-container').innerHTML = `
            <div class="quiz-result">
                <h3>Quiz Completed!</h3>
                <p>Your score: ${score} / ${total}</p>
                <button class="btn btn-secondary" onclick="restartQuiz()">Retry</button>
            </div>
        `;
    }

    window.restartQuiz = function () {
        currentIndex = 0;
        score = 0;
        document.getElementById('quiz-container').innerHTML = renderQuestion();
    };

    // Initial render
    return `<div id="quiz-container">${renderQuestion()}</div>`;
}
