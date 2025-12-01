export function NewsletterSignup() {
    return `
        <div class="newsletter-signup">
            <div class="newsletter-content">
                <h3>Stay Updated</h3>
                <p>Get the latest news about ChainTrees, new features, and environmental impact updates.</p>
                
                <form class="newsletter-form" onsubmit="handleNewsletterSubmit(event)">
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        required 
                        class="newsletter-input"
                        aria-label="Email address"
                    />
                    <button type="submit" class="newsletter-button">Subscribe</button>
                </form>

                <p class="newsletter-privacy">
                    We respect your privacy. Unsubscribe at any time.
                </p>
            </div>
        </div>
    `;
}

// Handle newsletter submission
window.handleNewsletterSubmit = function (event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;

    // TODO: Integrate with actual newsletter service
    console.log('Newsletter signup:', email);

    // Show success message
    const button = form.querySelector('.newsletter-button');
    const originalText = button.textContent;
    button.textContent = '✓ Subscribed!';
    button.disabled = true;

    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        form.reset();
    }, 3000);
};
