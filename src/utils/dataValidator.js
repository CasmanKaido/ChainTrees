export class DataValidator {
    /**
     * Validate Ethereum address
     */
    static isValidAddress(address) {
        if (!address || typeof address !== 'string') return false;
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    }

    /**
     * Validate email
     */
    static isValidEmail(email) {
        if (!email || typeof email !== 'string') return false;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /**
     * Validate number range
     */
    static isInRange(value, min, max) {
        const num = Number(value);
        return !isNaN(num) && num >= min && num <= max;
    }

    /**
     * Validate string length
     */
    static isValidLength(str, min, max) {
        if (typeof str !== 'string') return false;
        return str.length >= min && str.length <= max;
    }

    /**
     * Sanitize HTML
     */
    static sanitizeHTML(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }

    /**
     * Validate tree species
     */
    static isValidSpecies(species) {
        const validSpecies = ['Oak', 'Pine', 'Maple', 'Birch', 'Willow', 'Cedar'];
        return validSpecies.includes(species);
    }

    /**
     * Validate rarity
     */
    static isValidRarity(rarity) {
        const validRarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
        return validRarities.includes(rarity);
    }

    /**
     * Validate price
     */
    static isValidPrice(price) {
        const num = Number(price);
        return !isNaN(num) && num > 0 && num < 1000000;
    }

    /**
     * Validate date
     */
    static isValidDate(date) {
        const d = new Date(date);
        return d instanceof Date && !isNaN(d);
    }

    /**
     * Validate proposal data
     */
    static validateProposal(data) {
        const errors = [];

        if (!this.isValidLength(data.title, 5, 100)) {
            errors.push('Title must be between 5 and 100 characters');
        }

        if (!this.isValidLength(data.description, 20, 1000)) {
            errors.push('Description must be between 20 and 1000 characters');
        }

        if (!this.isValidAddress(data.creator)) {
            errors.push('Invalid creator address');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate listing data
     */
    static validateListing(data) {
        const errors = [];

        if (!data.treeId) {
            errors.push('Tree ID is required');
        }

        if (!this.isValidPrice(data.price)) {
            errors.push('Invalid price');
        }

        if (!this.isValidAddress(data.seller)) {
            errors.push('Invalid seller address');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate auction data
     */
    static validateAuction(data) {
        const errors = [];

        if (!data.treeId) {
            errors.push('Tree ID is required');
        }

        if (!this.isValidPrice(data.startingBid)) {
            errors.push('Invalid starting bid');
        }

        if (!this.isValidDate(data.endTime)) {
            errors.push('Invalid end time');
        }

        if (new Date(data.endTime) <= new Date()) {
            errors.push('End time must be in the future');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate form data
     */
    static validateForm(formData, rules) {
        const errors = {};

        Object.keys(rules).forEach(field => {
            const value = formData[field];
            const rule = rules[field];

            if (rule.required && !value) {
                errors[field] = `${field} is required`;
                return;
            }

            if (rule.type === 'email' && !this.isValidEmail(value)) {
                errors[field] = 'Invalid email address';
            }

            if (rule.type === 'address' && !this.isValidAddress(value)) {
                errors[field] = 'Invalid Ethereum address';
            }

            if (rule.minLength && value.length < rule.minLength) {
                errors[field] = `Minimum length is ${rule.minLength}`;
            }

            if (rule.maxLength && value.length > rule.maxLength) {
                errors[field] = `Maximum length is ${rule.maxLength}`;
            }

            if (rule.min && Number(value) < rule.min) {
                errors[field] = `Minimum value is ${rule.min}`;
            }

            if (rule.max && Number(value) > rule.max) {
                errors[field] = `Maximum value is ${rule.max}`;
            }
        });

        return {
            valid: Object.keys(errors).length === 0,
            errors
        };
    }
}

export const validator = DataValidator;
