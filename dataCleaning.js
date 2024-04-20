const fs = require('fs');
const readline = require('readline');

class Cell {
    constructor() {
        this.oem = '';
        this.model = '';
        this.launchAnnounced = null;
        this.launchStatus = '';
        this.bodyDimensions = '';
        this.bodyWeight = null;
        this.bodySim = '';
        this.displayType = '';
        this.displaySize = null;
        this.displayResolution = '';
        this.featuresSensors = '';
        this.platformOS = '';
    }

    setOEM(OEM) {
        this.oem = OEM;
    }

    setModel(model) {
        this.model = model;
    }

    setLaunchAnnounced(launchAnnounced) {
        this.launchAnnounced = launchAnnounced;
    }

    setLaunchStatus(launchStatus) {
        this.launchStatus = launchStatus;
    }

    setBodyDimensions(bodyDimensions) {
        this.bodyDimensions = bodyDimensions;
    }

    setBodyWeight(bodyWeight) {
        this.bodyWeight = bodyWeight;
    }

    setBodySim(bodySim) {
        this.bodySim = bodySim;
    }

    setDisplayType(displayType) {
        this.displayType = displayType;
    }

    setDisplaySize(displaySize) {
        this.displaySize = displaySize;
    }

    setDisplayResolution(displayResolution) {
        this.displayResolution = displayResolution;
    }

    setFeaturesSensors(featuresSensors) {
        this.featuresSensors = featuresSensors;
    }

    setPlatformOS(platformOS) {
        this.platformOS = platformOS;
    }
}

async function main() {
    const csvFile = 'cells.csv';
    const cellMap = new Map();
    const launchAnnouncedList = [];

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

        const data = line.split(',(?=(?:[^"]*"[^"]*")*[^"]*$)', -1);

        const cell = new Cell();
        cell.setOEM(cleanStrings(data[0]));
        cell.setModel(cleanStrings(data[1]));
        launchAnnouncedList.push(data[2]);
        cell.setLaunchAnnounced(cleanLaunchAnnounced(data[2]));
        cell.setLaunchStatus(cleanLaunchStatus(data[3]));
        cell.setBodyDimensions(cleanStrings(data[4]));
        cell.setBodyWeight(cleanBodyWeight(data[5]));
        cell.setBodySim(cleanBodySim(data[6]));
        cell.setDisplayType(cleanStrings(data[7]));
        cell.setDisplaySize(cleanDisplaySize(data[8]));
        cell.setDisplayResolution(cleanStrings(data[9]));
        cell.setFeaturesSensors(cleanFeatureSensors(data[10]));
        cell.setPlatformOS(cleanPlatformOS(data[11]));

        cellMap.set(id++, cell);
    });

    rl.on('close', () => {
        // After reading CSV file
        displayUniqueData(cellMap);
        // Other functionalities go here...
    });
}

// Helper functions
function clean(input) {
    if (!input || input.trim().length === 0 || input === "-") {
        return null;
    }
    return input.trim();
}

function cleanPlatformOS(input) {
    if (input === "-" || !input) {
        return null;
    }
    
    input = removeQuotes(input);

    // Regular expression pattern to match everything up to the first comma or end of string
    const pattern = /^(.*?)(?:,|$)/;
    const match = input.match(pattern);
    
    if (match) {
        return match[1].trim();
    } else {
        return input.trim();
    }
}

function removeQuotes(str) {
    return str.replace(/"/g, "");
}

function cleanStrings(input) {
    input = removeQuotes(input);
    if (!input || input === "-") {
        return null;
    }
    return input;
}

function cleanFeatureSensors(input) {
    input = removeQuotes(input);
    if (!input || input === "-") {
        return null;
    }
    if (/^\d+$/.test(input)) {
        return null;
    }
    return input;
}

function cleanLaunchAnnounced(input) {
    input = removeQuotes(input);

    if (input.length < 4 || !(/^\d+$/.test(input.substring(0, 4)))) {
        return null;
    }

    return parseInt(input.substring(0, 4));
}

function cleanBodyWeight(input) {
    const match = input.match(/(\d+) g/);
    if (match) {
        return parseFloat(match[1]);
    }
    return null;
}

function cleanDisplaySize(input) {
    const match = input.match(/(\d+) inches/);
    if (match) {
        return parseFloat(match[1]);
    }
    return null;
}

function cleanLaunchStatus(str) {
    str = removeQuotes(str);
    const pattern = /\b\d{4}\b/;
    if (str === "Discontinued" || str === "Cancelled") {
        return str;
    } else if (pattern.test(str)) {
        return str.match(pattern)[0];
    } else {
        return null;
    }
}

function isNumeric(input) {
    return /^\d+$/.test(input);
}

function onlyNumbers(input) {
    return /^\d+$/.test(input);
}

function cleanBodySim(input) {
    input = removeQuotes(input);
    if (input === "Yes" || input === "No") {
        return null;
    }
    return input;
}

function displayUniqueData(cellMap) {
    // Your code to display unique data goes here
}

// Call the main function to start the process
main().catch(err => console.error(err));