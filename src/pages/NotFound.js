export function NotFoundPage() {
    return `
        <div class="not-found-page">
            <div class="not-found-content">
                <h1 class="error-code">404</h1>
                <h2>Page Not Found</h2>
                <p>Oops! The page you're looking for seems to have wandered off into the forest.</p>
                
                <div class="not-found-actions">
                    <a href="/" class="btn btn-primary">Go Home</a>
                    <a href="/marketplace" class="btn btn-secondary">Visit Marketplace</a>
                </div>

                <div class="not-found-illustration">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <!-- Simple tree illustration -->
                        <circle cx="100" cy="60" r="40" fill="var(--success-color)" opacity="0.3"/>
                        <circle cx="80" cy="50" r="30" fill="var(--success-color)" opacity="0.5"/>
                        <circle cx="120" cy="50" r="30" fill="var(--success-color)" opacity="0.5"/>
                        <rect x="90" y="80" width="20" height="60" fill="var(--text-secondary)"/>
                        <text x="100" y="170" text-anchor="middle" font-size="16" fill="var(--text-color)">Lost?</text>
                    </svg>
                </div>
            </div>
        </div>
    `;
}
