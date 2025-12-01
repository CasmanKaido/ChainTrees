export function FAQPage() {
    const faqs = [
        {
            question: 'What is ChainTrees?',
            answer: 'ChainTrees is a blockchain-powered platform that combines NFT technology with real-world environmental impact. Each tree NFT represents a commitment to sustainability.'
        },
        {
            question: 'How do I get started?',
            answer: 'Connect your Web3 wallet (like MetaMask), then navigate to the Plant page to mint your first tree NFT. You can then explore the marketplace, participate in governance, and complete quests.'
        },
        {
            question: 'What blockchain does ChainTrees use?',
            answer: 'ChainTrees currently supports Ethereum and Polygon networks. You can switch between them in your wallet settings.'
        },
        {
            question: 'How much does it cost to mint a tree?',
            answer: 'Minting costs vary based on network gas fees. The base price for a tree NFT is displayed on the Plant page, plus network transaction fees.'
        },
        {
            question: 'Can I sell my tree NFTs?',
            answer: 'Yes! You can list your trees on our marketplace for direct sale or auction. The marketplace supports both fixed-price listings and time-limited auctions.'
        },
        {
            question: 'What is the DAO?',
            answer: 'The ChainTrees DAO (Decentralized Autonomous Organization) allows community members to propose and vote on platform improvements, treasury allocation, and other important decisions.'
        },
        {
            question: 'How do I earn XP and level up?',
            answer: 'You earn XP by minting trees, completing quests, participating in governance, maintaining daily login streaks, and engaging with the community.'
        },
        {
            question: 'Are there real-world environmental benefits?',
            answer: 'Yes! A portion of all proceeds goes toward real tree-planting initiatives and carbon offset programs. You can track the collective impact on your dashboard.'
        },
        {
            question: 'Is my wallet safe?',
            answer: 'We never store your private keys. All transactions are signed directly in your wallet. We follow industry best practices for security and have undergone security audits.'
        },
        {
            question: 'How can I contribute to the project?',
            answer: 'ChainTrees is open-source! You can contribute code, report bugs, suggest features, or help with documentation on our GitHub repository.'
        }
    ];

    return `
        <div class="faq-page">
            <div class="faq-hero">
                <h1>Frequently Asked Questions</h1>
                <p>Find answers to common questions about ChainTrees</p>
            </div>

            <div class="faq-content">
                ${faqs.map((faq, index) => `
                    <div class="faq-item" data-index="${index}">
                        <button class="faq-question" onclick="this.parentElement.classList.toggle('active')">
                            <span>${faq.question}</span>
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer">
                            <p>${faq.answer}</p>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="faq-contact">
                <h2>Still have questions?</h2>
                <p>Feel free to reach out to us on <a href="https://github.com/CasmanKaido/ChainTrees/issues">GitHub</a> or join our community Discord (coming soon).</p>
            </div>
        </div>
    `;
}
