export function SocialShare({ url, title }) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const twitter = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    const linkedin = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`;
    const reddit = `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;

    return `
        <div class="social-share">
            <a href="${twitter}" target="_blank" rel="noopener" class="share-btn twitter" aria-label="Share on Twitter">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.38 8.59 8.59 0 01-2.71 1.03 4.28 4.28 0 00-7.29 3.9A12.13 12.13 0 013 4.79a4.28 4.28 0 001.33 5.71 4.27 4.27 0 01-1.94-.54v.05a4.28 4.28 0 003.44 4.19 4.3 4.3 0 01-1.93.07 4.28 4.28 0 003.99 2.97A8.58 8.58 0 012 19.54a12.07 12.07 0 006.55 1.92c7.86 0 12.16-6.51 12.16-12.16 0-.19-.01-.39-.02-.58A8.68 8.68 0 0024 5.5a8.5 8.5 0 01-2.54.7z"/></svg>
            </a>
            <a href="${facebook}" target="_blank" rel="noopener" class="share-btn facebook" aria-label="Share on Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5 3.66 9.13 8.44 9.88v-6.99H7.9v-2.89h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.89h-2.34v6.99C18.34 21.13 22 17 22 12z"/></svg>
            </a>
            <a href="${linkedin}" target="_blank" rel="noopener" class="share-btn linkedin" aria-label="Share on LinkedIn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.025-3.036-1.85-3.036-1.851 0-2.135 1.445-2.135 2.939v5.666H9.354V9h3.414v1.561h.048c.476-.9 1.637-1.85 3.368-1.85 3.6 0 4.267 2.368 4.267 5.452v6.289zM5.337 7.433c-1.144 0-2.07-.927-2.07-2.07 0-1.144.926-2.07 2.07-2.07 1.144 0 2.07.926 2.07 2.07 0 1.143-.926 2.07-2.07 2.07zM6.814 20.452H3.86V9h2.954v11.452zM22.225 0H1.771C.792 0 0 .771 0 1.724v20.553C0 23.229.792 24 1.771 24h20.451C23.208 24 24 23.229 24 22.277V1.724C24 .771 23.208 0 22.225 0z"/></svg>
            </a>
            <a href="${reddit}" target="_blank" rel="noopener" class="share-btn reddit" aria-label="Share on Reddit">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zm-6.5-1.5c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5zm-9 0c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5zM12 15c-2.33 0-4.31-1.45-5.14-3.5h10.28c-.83 2.05-2.81 3.5-5.14 3.5z"/></svg>
            </a>
        </div>
    `;
}
