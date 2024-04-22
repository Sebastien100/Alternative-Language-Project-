const fs = require('fs');
const readline = require('readline');

class Cell {
    constructor() {
        this.oem = null;
        this.model = null;
        this.launchAnnounced = null;
        this.launchStatus = null;
        this.bodyDimensions = null;
        this.bodyWeight = null;
        this.bodySim = null;
        this.displayType = null;
        this.displaySize = null;
        this.displayResolution = null;
        this.featuresSensors = null;
        this.platformOS = null;
    }

    setOEM(OEM) {
        this.oem = cleanString(OEM);
    }

    setModel(model) {
        this.model = cleanString(model);
    }

    setLaunchAnnounced(launchAnnounced) {
        this.launchAnnounced = cleanLaunchAnnounced(launchAnnounced);
    }

    setLaunchStatus(launchStatus) {
        this.launchStatus = cleanLaunchStatus(launchStatus);
    }

    setBodyDimensions(bodyDimensions) {
        this.bodyDimensions = cleanString(bodyDimensions);
    }

    setBodyWeight(bodyWeight) {
        this.bodyWeight = cleanBodyWeight(bodyWeight);
    }

    setBodySim(bodySim) {
        this.bodySim = cleanBodySim(bodySim);
    }

    setDisplayType(displayType) {
        this.displayType = cleanString(displayType);
    }

    setDisplaySize(displaySize) {
        this.displaySize = cleanDisplaySize(displaySize);
    }

    setDisplayResolution(displayResolution) {
        this.displayResolution = cleanString(displayResolution);
    }

    setFeaturesSensors(featuresSensors) {
        this.featuresSensors = cleanString(featuresSensors);
    }

    setPlatformOS(platformOS) {
        this.platformOS = cleanPlatformOS(platformOS);
    }

    // Convert object details to a string for printing
    toString() {
        return `Cell: OEM - ${this.oem}, Model - ${this.model}, Launch Announced - ${this.launchAnnounced}, Launch Status - ${this.launchStatus}, Body Dimensions - ${this.bodyDimensions}, Body Weight - ${this.bodyWeight}, Body SIM - ${this.bodySim}, Display Type - ${this.displayType}, Display Size - ${this.displaySize}, Display Resolution - ${this.displayResolution}, Features/Sensors - ${this.featuresSensors}, Platform OS - ${this.platformOS}`;
    }

    // Calculate statistics on numeric columns
    calculateStatistics() {
        const numericColumns = ['launchAnnounced', 'bodyWeight', 'displaySize'];
        const stats = {};

        numericColumns.forEach(column => {
            const values = [];
            for (const obj of cellList) {
                if (obj[column] !== null && typeof obj[column] === 'number') {
                    values.push(obj[column]);
                }
            }

            if (values.length > 0) {
                stats[column] = {
                    mean: values.reduce((acc, curr) => acc + curr, 0) / values.length,
                    median: calculateMedian(values),
                    standardDeviation: calculateStandardDeviation(values)
                };
            }
        });

        return stats;
    }

    // List unique values for each column
    listUniqueValues() {
        const uniqueValues = {};

        for (const property in this) {
            if (this.hasOwnProperty(property) && this[property] !== null) {
                const value = this[property];
                if (!uniqueValues[property]) {
                    uniqueValues[property] = new Set();
                }
                uniqueValues[property].add(value);
            }
        }

        return uniqueValues;
    }

    // Add an object with data for each variable
    static addObject(data) {
        const cell = new Cell();
        for (const key in data) {
            if (cell.hasOwnProperty(key) && data[key] !== undefined) {
                cell[key] = data[key];
            }
        }
        cellList.push(cell);
    }

    // Delete an object by index
    static deleteObject(index) {
        if (index >= 0 && index < cellList.length) {
            cellList.splice(index, 1);
        }
    }
}

// Helper functions for data cleaning and processing
function cleanString(input) {
    return typeof input === 'string' ? input.trim() : null;
}

function cleanLaunchAnnounced(input) {
    if (!input || !/^\d{4}$/.test(input)) {
        return null;
    }
    return parseInt(input, 10);
}

function cleanLaunchStatus(input) {
    return cleanString(input); // No specific cleaning for launch status
}

function cleanBodyWeight(input) {
    const match = input.match(/(\d+)\s*g/);
    return match ? parseFloat(match[1]) : null;
}

function cleanBodySim(input) {
    return input === 'No' || input === 'Yes' ? null : cleanString(input);
}

function cleanPlatformOS(input) {
    return cleanString(input); // No specific cleaning for platform OS
}

function cleanDisplaySize(input) {
    const match = input.match(/([\d.]+)\s*inches?/);
    return match ? parseFloat(match[1]) : null;
}

function calculateMedian(values) {
    const sorted = values.slice().sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function calculateStandardDeviation(values) {
    const mean = values.reduce((acc, curr) => acc + curr, 0) / values.length;
    const variance = values.reduce((acc, curr) => acc + (curr - mean) ** 2, 0) / values.length;
    return Math.sqrt(variance);
}

const cellList = [];

async function main() {
    try {
        const csvFile = 'cells.csv';
        const fileStream = fs.createReadStream(csvFile);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        let id = 1;

        rl.on('line', (line) => {
            if (id === 1) {
                id++;
                return; // Skip the headers
            }

            const data = line.split(',');
            const cell = new Cell();

            try {
                cell.setOEM(data[0]);
                cell.setModel(data[1]);
                cell.setLaunchAnnounced(data[2]);
                cell.setLaunchStatus(data[3]);
                cell.setBodyDimensions(data[4]);
                cell.setBodyWeight(data[5]);
                cell.setBodySim(data[6]);
                cell.setDisplayType(data[7]);
                cell.setDisplaySize(data[8]);
                cell.setDisplayResolution(data[9]);
                cell.setFeaturesSensors(data[10]);
                cell.setPlatformOS(data[11]);

                cellList.push(cell);
            } catch (err) {
                console.error('Error processing line:', err.message);
            }
        });

        rl.on('close', () => {
            if (cellList.length > 0) {
                console.log('CSV file processed successfully.');

                // Answering the questions

                // What company (oem) has the highest average weight of the phone body?
                const avgWeightByOEM = {};
                for (const cell of cellList) {
                    if (cell.bodyWeight !== null) {
                        if (!avgWeightByOEM[cell.oem]) {
                            avgWeightByOEM[cell.oem] = [];
                        }
                        avgWeightByOEM[cell.oem].push(cell.bodyWeight);
                    }
                }
                let maxAvgWeight = 0;
                let oemWithMaxAvgWeight = null;
                for (const oem in avgWeightByOEM) {
                    const weights = avgWeightByOEM[oem];
                    const avgWeight = weights.reduce((sum, weight) => sum + weight, 0) / weights.length;
                    if (avgWeight > maxAvgWeight) {
                        maxAvgWeight = avgWeight;
                        oemWithMaxAvgWeight = oem;
                    }
                }
                console.log(`Company with the highest average weight: ${oemWithMaxAvgWeight}`);

                // Was there any phones that were announced in one year and released in another? What are they?
                const phonesWithDifferentAnnounceAndReleaseYears = cellList.filter(cell => cell.launchAnnounced !== null && cell.launchStatus !== null && cell.launchAnnounced !== cell.launchStatus);
                if (phonesWithDifferentAnnounceAndReleaseYears.length > 0) {
                    console.log('Phones announced in one year and released in another:');
                    phonesWithDifferentAnnounceAndReleaseYears.forEach(cell => {
                        console.log(`OEM: ${cell.oem}, Model: ${cell.model}, Announced: ${cell.launchAnnounced}, Released: ${cell.launchStatus}`);
                    });
                } else {
                    console.log('No phones were announced in one year and released in another.');
                }

                // How many phones have only one feature sensor?
                const phonesWithOneFeatureSensor = cellList.filter(cell => cell.featuresSensors !== null && cell.featuresSensors.split(',').length === 1);
                console.log(`Phones with only one feature sensor: ${phonesWithOneFeatureSensor.length}`);

                // What year had the most phones launched in any year later than 1999?
                const launchCountsByYear = {};
                cellList.forEach(cell => {
                    if (cell.launchAnnounced !== null && cell.launchAnnounced > 1999) {
                        if (!launchCountsByYear[cell.launchAnnounced]) {
                            launchCountsByYear[cell.launchAnnounced] = 0;
                        }
                        launchCountsByYear[cell.launchAnnounced]++;
                    }
                });
                let maxLaunchCount = 0;
                let yearWithMaxLaunches = null;
                for (const year in launchCountsByYear) {
                    if (launchCountsByYear[year] > maxLaunchCount) {
                        maxLaunchCount = launchCountsByYear[year];
                        yearWithMaxLaunches = year;
                    }
                }
                console.log(`Year with the most phones launched after 1999: ${yearWithMaxLaunches}`);
            } else {
                console.log('No cell data available.');
            }
        });
    } catch (err) {
        console.error('An error occurred during file processing:', err.message);
    }
}

main().catch(err => console.error(err));
