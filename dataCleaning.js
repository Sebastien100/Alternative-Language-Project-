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

// Helper function to clean string values
function cleanString(input) {
    if (!input || input.trim() === "" || input.trim() === "-" || input.trim() === "No" || input.trim() === "Yes") {
        return null;
    }
    return input.trim();
}

// Helper function to clean launch announced year
function cleanLaunchAnnounced(input) {
    const match = input.match(/\b\d{4}\b/);
    return match ? parseInt(match[0]) : null;
}

// Helper function to clean launch status
function cleanLaunchStatus(input) {
    if (input === "Discontinued" || input === "Cancelled") {
        return input;
    }
    const match = input.match(/\b\d{4}\b/);
    return match ? match[0] : null;
}

// Helper function to clean body weight and convert to float
function cleanBodyWeight(input) {
    const match = input.match(/(\d+) g/);
    return match ? parseFloat(match[1]) : null;
}

// Helper function to clean display size and convert to float
function cleanDisplaySize(input) {
    const match = input.match(/([\d.]+) inches/);
    return match ? parseFloat(match[1]) : null;
}

// Helper function to clean body SIM type
function cleanBodySim(input) {
    return input === "No" || input === "Yes" ? null : input;
}

// Helper function to clean platform OS and extract the OS name
function cleanPlatformOS(input) {
    if (!input || input.trim() === "" || input.trim() === "-") {
        return null;
    }
    input = removeExtraInfo(input);
    return input.trim();
}

// Helper function to clean display size and convert to float
function cleanDisplaySize(input) {
    const match = input.match(/([\d.]+) inches/);
    return match ? parseFloat(match[1]) : null;
}