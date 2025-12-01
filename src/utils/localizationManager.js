export class LocalizationManager {
  constructor() {
    this.currentLocale = this.loadLocale()
    this.translations = {}
    this.fallbackLocale = 'en'
    this.loadTranslations()
  }

  loadLocale() {
    const stored = localStorage.getItem('chaintrees_locale')
    if (stored) return stored

    // Detect browser language
    const browserLang = navigator.language.split('-')[0]
    return ['en', 'es', 'fr', 'de', 'ja', 'zh'].includes(browserLang) ? browserLang : 'en'
  }

  saveLocale(locale) {
    localStorage.setItem('chaintrees_locale', locale)
  }

  loadTranslations() {
    // English
    this.translations.en = {
      common: {
        welcome: 'Welcome',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        confirm: 'Confirm',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        close: 'Close'
      },
      landing: {
        hero_title: 'Hi there, Welcome to ChainTrees!',
        hero_subtitle: 'NFT Tree Planting Platform | Blockchain for Good | Carbon Offset Tracking',
        cta_plant: 'Start Planting',
        cta_explore: 'Explore Marketplace'
      },
      marketplace: {
        title: 'NFT Marketplace',
        buy: 'Buy Now',
        sell: 'List for Sale',
        price: 'Price',
        seller: 'Seller'
      },
      governance: {
        title: 'DAO Governance',
        create_proposal: 'New Proposal',
        vote_for: 'Vote For',
        vote_against: 'Vote Against',
        voting_power: 'Your Voting Power'
      }
    }

    // Spanish
    this.translations.es = {
      common: {
        welcome: 'Bienvenido',
        loading: 'Cargando...',
        error: 'Error',
        success: 'Éxito',
        cancel: 'Cancelar',
        confirm: 'Confirmar',
        save: 'Guardar',
        delete: 'Eliminar',
        edit: 'Editar',
        close: 'Cerrar'
      },
      landing: {
        hero_title: '¡Hola, Bienvenido a ChainTrees!',
        hero_subtitle:
          'Plataforma NFT de Plantación de Árboles | Blockchain para el Bien | Seguimiento de Compensación de Carbono',
        cta_plant: 'Comenzar a Plantar',
        cta_explore: 'Explorar Mercado'
      },
      marketplace: {
        title: 'Mercado NFT',
        buy: 'Comprar Ahora',
        sell: 'Listar para Venta',
        price: 'Precio',
        seller: 'Vendedor'
      },
      governance: {
        title: 'Gobernanza DAO',
        create_proposal: 'Nueva Propuesta',
        vote_for: 'Votar a Favor',
        vote_against: 'Votar en Contra',
        voting_power: 'Tu Poder de Voto'
      }
    }

    // French
    this.translations.fr = {
      common: {
        welcome: 'Bienvenue',
        loading: 'Chargement...',
        error: 'Erreur',
        success: 'Succès',
        cancel: 'Annuler',
        confirm: 'Confirmer',
        save: 'Enregistrer',
        delete: 'Supprimer',
        edit: 'Modifier',
        close: 'Fermer'
      },
      landing: {
        hero_title: 'Bonjour, Bienvenue sur ChainTrees!',
        hero_subtitle:
          "Plateforme NFT de Plantation d'Arbres | Blockchain pour le Bien | Suivi de Compensation Carbone",
        cta_plant: 'Commencer à Planter',
        cta_explore: 'Explorer le Marché'
      },
      marketplace: {
        title: 'Marché NFT',
        buy: 'Acheter Maintenant',
        sell: 'Mettre en Vente',
        price: 'Prix',
        seller: 'Vendeur'
      },
      governance: {
        title: 'Gouvernance DAO',
        create_proposal: 'Nouvelle Proposition',
        vote_for: 'Voter Pour',
        vote_against: 'Voter Contre',
        voting_power: 'Votre Pouvoir de Vote'
      }
    }
  }

  /**
   * Get translation
   */
  t(key, params = {}) {
    const keys = key.split('.')
    let value = this.translations[this.currentLocale]

    // Navigate through nested keys
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) break
    }

    // Fallback to English if not found
    if (value === undefined) {
      value = this.translations[this.fallbackLocale]
      for (const k of keys) {
        value = value?.[k]
        if (value === undefined) break
      }
    }

    // If still not found, return the key
    if (value === undefined) {
      return key
    }

    // Replace parameters
    let result = value
    Object.entries(params).forEach(([param, val]) => {
      result = result.replace(`{${param}}`, val)
    })

    return result
  }

  /**
   * Set locale
   */
  setLocale(locale) {
    if (!this.translations[locale]) {
      console.warn(`Locale ${locale} not found`)
      return false
    }

    this.currentLocale = locale
    this.saveLocale(locale)

    // Dispatch locale change event
    window.dispatchEvent(
      new CustomEvent('localechange', {
        detail: { locale }
      })
    )

    return true
  }

  /**
   * Get current locale
   */
  getLocale() {
    return this.currentLocale
  }

  /**
   * Get available locales
   */
  getAvailableLocales() {
    return Object.keys(this.translations).map(code => ({
      code,
      name: this.getLocaleName(code)
    }))
  }

  /**
   * Get locale name
   */
  getLocaleName(code) {
    const names = {
      en: 'English',
      es: 'Español',
      fr: 'Français',
      de: 'Deutsch',
      ja: '日本語',
      zh: '中文'
    }
    return names[code] || code
  }

  /**
   * Format number based on locale
   */
  formatNumber(number, options = {}) {
    return new Intl.NumberFormat(this.currentLocale, options).format(number)
  }

  /**
   * Format date based on locale
   */
  formatDate(date, options = {}) {
    return new Intl.DateTimeFormat(this.currentLocale, options).format(date)
  }

  /**
   * Format currency based on locale
   */
  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat(this.currentLocale, {
      style: 'currency',
      currency
    }).format(amount)
  }
}

export const i18n = new LocalizationManager()
