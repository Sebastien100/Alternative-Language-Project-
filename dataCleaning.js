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
        if (typeof launchAnnounced !== 'string') {
            throw new Error('Launch announced must be a valid string.');
        }
        this.launchAnnounced = cleanLaunchAnnounced(launchAnnounced);
    }

    setLaunchStatus(launchStatus) {
        if (typeof launchStatus !== 'string') {
            throw new Error('Launch status must be a valid string.');
        }
        this.launchStatus = cleanLaunchStatus(launchStatus);
    }

    setBodyDimensions(bodyDimensions) {
        this.bodyDimensions = cleanString(bodyDimensions);
    }

    setBodyWeight(bodyWeight) {
        if (typeof bodyWeight !== 'string') {
            throw new Error('Body weight must be a valid string.');
        }
        this.bodyWeight = cleanBodyWeight(bodyWeight);
    }

    setBodySim(bodySim) {
        this.bodySim = cleanBodySim(bodySim);
    }

    setDisplayType(displayType) {
        this.displayType = cleanString(displayType);
    }

    setDisplaySize(displaySize) {
        if (typeof displaySize !== 'string') {
            throw new Error('Display size must be a valid string.');
        }
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

// Helper function to clean string values
function cleanString(input) {
    if (!input || typeof input !== 'string' || input.trim() === "" || input.trim() === "-" || input.trim() === "No" || input.trim() === "Yes") {
        return null;
    }
    return input.trim();
}

// Helper function to clean launch announced year
function cleanLaunchAnnounced(input) {
    if (!input) {
        return null;
    }
    const match = input.match(/\b\d{4}\b/);
    return match ? parseInt(match[0]) : null;
}

// Helper function to clean launch status
function cleanLaunchStatus(input) {
    if (!input) {
        return null;
    }
    const match = input.match(/\b\d{4}\b/);
    return match ? match[0] : null;
}

// Helper function to clean body weight and convert to float
function cleanBodyWeight(input) {
    if (!input) {
        return null;
    }
    const match = input.match(/(\d+) g/);
    return match ? parseFloat(match[1]) : null;
}

// Helper function to clean body SIM type
function cleanBodySim(input) {
    return input === "No" || input === "Yes" ? null : input;
}

// Helper function to clean platform OS and extract the OS name
function cleanPlatformOS(input) {
    if (!input || typeof input !== 'string' || input.trim() === "" || input.trim() === "-") {
        return null;
    }
    input = removeExtraInfo(input);
    return input.trim();
}

// Helper function to clean display size and convert to float
function cleanDisplaySize(input) {
    if (!input || typeof input !== 'string') {
        throw new Error('Invalid display size input.');
    }
    const match = input.match(/([\d.]+) inches/);
    if (!match) {
        throw new Error('Invalid display size format.');
    }
    return parseFloat(match[1]);
}

// Helper function to remove extra information (up to the first comma)
function removeExtraInfo(input) {
    const match = input.match(/^(.*?)(?:,|$)/);
    return match ? match[1].trim() : input.trim();
}

// Helper function to calculate median of values
function calculateMedian(values) {
    const sorted = values.sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

// Helper function to calculate standard deviation of values
function calculateStandardDeviation(values) {
    const mean = values.reduce((acc, curr) => acc + curr, 0) / values.length;
    const variance = values.reduce((acc, curr) => acc + (curr - mean) ** 2, 0) / values.length;
    return Math.sqrt(variance);
}

// Array to store cell objects
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
            try {
                if (id === 1) {
                    id++;
                    return; // Skip the headers
                }

                const data = line.split(',(?=(?:[^"]*"[^"]*")*[^"]*$)', -1);
                const cell = new Cell();

                // Validate and set properties
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
            // Process completed successfully
            console.log('CSV file processed successfully.');

            // Example usage of Cell class methods
            console.log(cellList[0].toString());
            console.log(cellList[0].calculateStatistics());
            console.log(cellList[0].listUniqueValues());

            // Add new object
            Cell.addObject({
                oem: 'Samsung',
                model: 'Galaxy S20',
                launchAnnounced: '2020',
                launchStatus: 'Discontinued',
                bodyDimensions: '151.7 x 69.1 x 7.9 mm',
                bodyWeight: '163 g',
                bodySim: 'Yes',
                displayType: 'Dynamic AMOLED',
                displaySize: '6.2 inches',
                displayResolution: '1440 x 3200 pixels',
                featuresSensors: 'Fingerprint (under display, ultrasonic), accelerometer, gyro, proximity, compass, barometer',
                platformOS: 'Android 10, upgradable to Android 11'
            });

            console.log(cellList);

            // Delete an object
            Cell.deleteObject(1);
            console.log(cellList);
        });
    } catch (err) {
        console.error('An error occurred during file processing:', err.message);
    }
}

// Call the main function to start the process
main().catch(err => console.error(err));
