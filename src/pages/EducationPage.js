export function EducationPage() {
  return `
        <div class="education-page">
            <section class="hero">
                <h1>Learn & Grow</h1>
                <p class="subtitle">Empowering you with knowledge to make a real impact.</p>
            </section>

            <section class="resources">
                <h2>Educational Resources</h2>
                <div class="resource-grid">
                    <article class="resource-card">
                        <h3>Understanding Carbon Offsets</h3>
                        <p>Explore how carbon offsets work, their benefits, and how ChainTrees contributes to real-world impact.</p>
                        <a href="https://www.carbonoffsetguide.org" target="_blank" rel="noopener" class="resource-link">Read More</a>
                    </article>
                    <article class="resource-card">
                        <h3>Blockchain for Good</h3>
                        <p>Learn how blockchain technology can be leveraged for environmental and social good.</p>
                        <a href="https://www.blockchaingood.org" target="_blank" rel="noopener" class="resource-link">Read More</a>
                    </article>
                    <article class="resource-card">
                        <h3>Tree Species & Ecosystems</h3>
                        <p>Discover the different tree species available in the game and their ecological importance.</p>
                        <a href="https://www.treespeciesinfo.com" target="_blank" rel="noopener" class="resource-link">Read More</a>
                    </article>
                </div>
            </section>

            <section class="quiz-section">
                <h2>Test Your Knowledge</h2>
                <p>Take our quick quiz to earn XP and unlock exclusive badges.</p>
                <button class="btn btn-primary" onclick="startEducationQuiz()">Start Quiz</button>
            </section>
        </div>
    `;
}

window.startEducationQuiz = function () {
  // Placeholder for quiz logic – will be implemented later
  alert('Quiz coming soon!');
};
