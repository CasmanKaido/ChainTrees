export class ExportManager {
    constructor() {
        this.formats = ['json', 'csv', 'pdf'];
    }

    /**
     * Export data to JSON
     */
    exportJSON(data, filename = 'chaintrees-export') {
        const jsonString = JSON.stringify(data, null, 2);
        this.downloadFile(jsonString, `${filename}.json`, 'application/json');
    }

    /**
     * Export data to CSV
     */
    exportCSV(data, filename = 'chaintrees-export') {
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Data must be a non-empty array');
        }

        const headers = Object.keys(data[0]);
        const csvRows = [];

        // Add headers
        csvRows.push(headers.join(','));

        // Add data rows
        for (const row of data) {
            const values = headers.map(header => {
                const value = row[header];
                // Escape quotes and wrap in quotes if contains comma
                const escaped = String(value).replace(/"/g, '""');
                return escaped.includes(',') ? `"${escaped}"` : escaped;
            });
            csvRows.push(values.join(','));
        }

        const csvString = csvRows.join('\n');
        this.downloadFile(csvString, `${filename}.csv`, 'text/csv');
    }

    /**
     * Export forest data
     */
    exportForestData(trees, userAddress) {
        const exportData = {
            owner: userAddress,
            exportDate: new Date().toISOString(),
            totalTrees: trees.length,
            trees: trees.map(tree => ({
                id: tree.id,
                species: tree.species,
                rarity: tree.rarity,
                level: tree.level,
                xp: tree.xp,
                plantedDate: tree.plantedDate,
                carbonOffset: tree.carbonOffset
            }))
        };

        this.exportJSON(exportData, `forest-${userAddress.substr(0, 8)}`);
    }

    /**
     * Export marketplace data
     */
    exportMarketplaceData(listings) {
        const csvData = listings.map(listing => ({
            treeId: listing.treeId,
            species: listing.tree.species,
            rarity: listing.tree.rarity,
            price: listing.price,
            seller: listing.seller,
            listedDate: new Date(listing.timestamp).toLocaleDateString()
        }));

        this.exportCSV(csvData, 'marketplace-listings');
    }

    /**
     * Export analytics data
     */
    exportAnalytics(analyticsData) {
        const exportData = {
            exportDate: new Date().toISOString(),
            summary: analyticsData.summary,
            events: analyticsData.events.map(event => ({
                type: event.type,
                timestamp: new Date(event.data.timestamp).toISOString(),
                ...event.data
            }))
        };

        this.exportJSON(exportData, 'analytics-report');
    }

    /**
     * Export transaction history
     */
    exportTransactions(transactions) {
        const csvData = transactions.map(tx => ({
            id: tx.id,
            type: tx.type,
            treeId: tx.item?.id || '',
            species: tx.item?.species || '',
            price: tx.price,
            from: tx.from,
            to: tx.to,
            date: new Date(tx.timestamp).toLocaleDateString(),
            txHash: tx.txHash
        }));

        this.exportCSV(csvData, 'transaction-history');
    }

    /**
     * Download file
     */
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /**
     * Import JSON data
     */
    async importJSON(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    resolve(data);
                } catch (error) {
                    reject(new Error('Invalid JSON file'));
                }
            };

            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    /**
     * Import CSV data
     */
    async importCSV(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const text = e.target.result;
                    const lines = text.split('\n');
                    const headers = lines[0].split(',');

                    const data = lines.slice(1).map(line => {
                        const values = line.split(',');
                        const obj = {};
                        headers.forEach((header, index) => {
                            obj[header.trim()] = values[index]?.trim() || '';
                        });
                        return obj;
                    });

                    resolve(data);
                } catch (error) {
                    reject(new Error('Invalid CSV file'));
                }
            };

            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    /**
     * Create backup of all data
     */
    createBackup() {
        const backup = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            data: {
                localStorage: { ...localStorage },
                sessionData: {
                    // Add any session-specific data
                }
            }
        };

        this.exportJSON(backup, `chaintrees-backup-${Date.now()}`);
    }

    /**
     * Restore from backup
     */
    async restoreBackup(file) {
        const backup = await this.importJSON(file);

        if (!backup.version || !backup.data) {
            throw new Error('Invalid backup file');
        }

        // Restore localStorage
        Object.entries(backup.data.localStorage).forEach(([key, value]) => {
            localStorage.setItem(key, value);
        });

        return backup;
    }
}

export const exportManager = new ExportManager();
