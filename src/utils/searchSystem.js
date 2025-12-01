export class SearchSystem {
  constructor() {
    this.index = new Map()
    this.documents = []
  }

  /**
   * Add document to search index
   */
  addDocument(id, content, metadata = {}) {
    const doc = {
      id,
      content,
      metadata,
      tokens: this.tokenize(content)
    }

    this.documents.push(doc)
    this.indexDocument(doc)
  }

  /**
   * Tokenize text for searching
   */
  tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 2)
  }

  /**
   * Index document tokens
   */
  indexDocument(doc) {
    doc.tokens.forEach(token => {
      if (!this.index.has(token)) {
        this.index.set(token, new Set())
      }
      this.index.get(token).add(doc.id)
    })
  }

  /**
   * Search documents
   */
  search(query, options = {}) {
    const { limit = 10, fuzzy = true, filters = {} } = options

    const queryTokens = this.tokenize(query)
    const scores = new Map()

    // Calculate relevance scores
    queryTokens.forEach(token => {
      const matchingDocs = this.index.get(token) || new Set()

      matchingDocs.forEach(docId => {
        scores.set(docId, (scores.get(docId) || 0) + 1)
      })

      // Fuzzy matching
      if (fuzzy) {
        this.index.forEach((docIds, indexToken) => {
          if (this.isSimilar(token, indexToken)) {
            docIds.forEach(docId => {
              scores.set(docId, (scores.get(docId) || 0) + 0.5)
            })
          }
        })
      }
    })

    // Get documents and sort by score
    let results = Array.from(scores.entries())
      .map(([id, score]) => ({
        document: this.documents.find(d => d.id === id),
        score
      }))
      .filter(r => r.document)
      .sort((a, b) => b.score - a.score)

    // Apply filters
    if (Object.keys(filters).length > 0) {
      results = results.filter(r => {
        return Object.entries(filters).every(([key, value]) => {
          return r.document.metadata[key] === value
        })
      })
    }

    return results.slice(0, limit)
  }

  /**
   * Check if two tokens are similar (simple Levenshtein distance)
   */
  isSimilar(a, b, threshold = 2) {
    if (Math.abs(a.length - b.length) > threshold) return false

    const distance = this.levenshteinDistance(a, b)
    return distance <= threshold
  }

  /**
   * Calculate Levenshtein distance
   */
  levenshteinDistance(a, b) {
    const matrix = []

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }

    return matrix[b.length][a.length]
  }

  /**
   * Get suggestions for autocomplete
   */
  getSuggestions(prefix, limit = 5) {
    const lowerPrefix = prefix.toLowerCase()
    const suggestions = new Set()

    this.index.forEach((_, token) => {
      if (token.startsWith(lowerPrefix)) {
        suggestions.add(token)
      }
    })

    return Array.from(suggestions).slice(0, limit)
  }

  /**
   * Clear search index
   */
  clear() {
    this.index.clear()
    this.documents = []
  }

  /**
   * Get index stats
   */
  getStats() {
    return {
      totalDocuments: this.documents.length,
      totalTokens: this.index.size,
      avgTokensPerDoc:
        this.documents.length > 0
          ? this.documents.reduce((sum, doc) => sum + doc.tokens.length, 0) / this.documents.length
          : 0
    }
  }
}

export const searchSystem = new SearchSystem()
