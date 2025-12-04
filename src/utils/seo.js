/**
 * SEO Utility
 * Dynamically updates page meta tags for better SEO
 */

export function applySEO(options = {}) {
    const defaults = {
        title: 'ChainTrees - Plant Trees On-Chain',
        description: 'Plant trees on-chain and track your real-world environmental impact with blockchain technology.',
        image: '/images/og-image.png',
        url: window.location.href
    }

    const seo = { ...defaults, ...options }

    // Update title
    document.title = seo.title

    // Update or create meta tags
    updateMetaTag('description', seo.description)
    updateMetaTag('og:title', seo.title, 'property')
    updateMetaTag('og:description', seo.description, 'property')
    updateMetaTag('og:image', seo.image, 'property')
    updateMetaTag('og:url', seo.url, 'property')
    updateMetaTag('twitter:title', seo.title, 'name')
    updateMetaTag('twitter:description', seo.description, 'name')
    updateMetaTag('twitter:image', seo.image, 'name')
}

function updateMetaTag(key, content, attribute = 'name') {
    let element = document.querySelector(`meta[${attribute}="${key}"]`)

    if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, key)
        document.head.appendChild(element)
    }

    element.setAttribute('content', content)
}
