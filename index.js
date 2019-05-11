const fs = require('fs-extra');
const path = require('path');
const { ArgumentParser } = require('argparse');
const { Gpio } = require('onoff');
const onMount = require('./drive.js');

const parser = new ArgumentParser({
    addHelp: true
});

parser.addArgument(
    ['-p', '--path'],
    {
        help: 'The path to the files that are getting copied'
    }
);
parser.addArgument(
    ['-f', '--folder-name'],
    {
        help: 'The name of the folder that the files are copied to'
    }
);
parser.addArgument(
    ['-s', '--success-led-pin'],
    {
        help: 'The pin ID of the success LED'
    }
);

parser.addArgument(
    ['-e', '--error-led-pin'],
    {
        help: 'The pin ID of the error LED'
    }
);

const args = parser.parseArgs();

const DATA_PATH = args.path || './data/';
const FOLDER_NAME = args.folder_name || 'data';
const SUCCESS_LED_PIN = args.success_led_pin || 17;
const ERROR_LED_PIN = args.error_led_pin || 18;
const LED_BLINK_TIME = 1000;

let ledSuccess;
let ledError;
try {
    ledSuccess = new Gpio(SUCCESS_LED_PIN, 'out');
    ledError = new Gpio(ERROR_LED_PIN, 'out');
} catch (err) {
    console.error("GPIO pins not available");
}

onMount(drive => {
    if (drive.mountpoints.length <= 0/* || !drive.isUSB*/) {
        return;
    }
    console.log(`Drive '${drive.mountpoints[0].path}' connected`);
    try {
        copyFiles(drive.mountpoints[0].path);
        showSuccessLED();
    } catch (err) {
        console.error(err);
        showErrorLED();
    }

});

console.log(`Waiting for drives to be connected`);

function copyFiles(copyPath) {
    if (!fs.existsSync(DATA_PATH)) {
        throw `The path '${DATA_PATH}' does not exist`;
    }

    let destination = createFolderPath(copyPath);

    console.log(`Copying files to '${destination}'`);

    fs.ensureDirSync(destination);
    fs.copySync(DATA_PATH, destination);
    console.log(`Copied files to '${destination}'`);
}

function createFolderPath(copyPath) {
    let i = 1;
    let destination = path.join(copyPath, FOLDER_NAME);
    while (fs.existsSync(destination)) {
        destination = path.join(copyPath, `${FOLDER_NAME}${i}`);
        i++;
    }
    return destination;
}

function showSuccessLED() {
    if (!ledSuccess) {
        return;
    }

    ledSuccess.writeSync(1);
    setTimeout(() => {
        ledSuccess.writeSync(0);
    }, LED_BLINK_TIME);

}

function showErrorLED() {
    if (!ledError) {
        return;
    }

    ledError.writeSync(1);
    setTimeout(() => {
        ledError.writeSync(0);
    }, LED_BLINK_TIME);
}