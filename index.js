const fs = require('fs-extra');
const path = require('path');
const onMount = require('./drive.js');

const { ArgumentParser } = require('argparse');

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

const args = parser.parseArgs();

const DATA_PATH = args.path || './data/';
const FOLDER_NAME = args.folder_name || 'data';

onMount(drive => {
    if (drive.mountpoints.length <= 0/* || !drive.isUSB*/) {
        return;
    }
    console.log(`Drive '${drive.mountpoints[0].path}' connected`);
    copyFiles(drive.mountpoints[0].path)
});

console.log(`Waiting for drives to be connected`);

function copyFiles(copyPath) {
    if (!fs.existsSync(DATA_PATH)) {
        console.error(`The path '${DATA_PATH}' does not exist`);
        return;
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
