export function LoadingSkeleton({ type = 'card', count = 1 }) {
    const skeletons = [];

    for (let i = 0; i < count; i++) {
        if (type === 'card') {
            skeletons.push(`
                <div class="skeleton-card" key="${i}">
                    <div class="skeleton-image"></div>
                    <div class="skeleton-text"></div>
                    <div class="skeleton-text short"></div>
                </div>
            `);
        } else if (type === 'list') {
            skeletons.push(`
                <div class="skeleton-list-item" key="${i}">
                    <div class="skeleton-avatar"></div>
                    <div class="skeleton-content">
                        <div class="skeleton-text"></div>
                        <div class="skeleton-text short"></div>
                    </div>
                </div>
            `);
        } else if (type === 'text') {
            skeletons.push(`
                <div class="skeleton-text-block" key="${i}">
                    <div class="skeleton-text"></div>
                    <div class="skeleton-text"></div>
                    <div class="skeleton-text short"></div>
                </div>
            `);
        }
    }

    return skeletons.join('');
}

export function showSkeleton(container, type = 'card', count = 3) {
    if (container) {
        container.innerHTML = LoadingSkeleton({ type, count });
    }
}

export function hideSkeleton(container, content) {
    if (container) {
        container.innerHTML = content;
    }
}
