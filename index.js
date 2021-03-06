const fs = require("fs-extra");
const path = require("path");
const { ArgumentParser } = require("argparse");
const { Gpio } = require("onoff");
const onMount = require("./drive.js");
const { mount, unmount } = require("./mount.js");

const parser = new ArgumentParser({
  add_help: true
});

parser.add_argument("-p", "--path", {
  help: "The path to the files that are getting copied"
});
parser.add_argument("-f", "--folder-name", {
  help: "The name of the folder that the files are copied to"
});
parser.add_argument("-s", "--success-led-pin", {
  help: "The pin ID of the success LED"
});
parser.add_argument("-P", "--progress-led-pin", {
  help: "The pin ID of the progress LED"
});
parser.add_argument("-e", "--error-led-pin", {
  help: "The pin ID of the error LED"
});

const args = parser.parse_args();

const DATA_PATH = args.path || "./data/";
const FOLDER_NAME = args.folder_name || "data";
const SUCCESS_LED_PIN = args.success_led_pin || 17;
const PROGRESS_LED_PIN = args.progress_led_pin || 27;
const ERROR_LED_PIN = args.error_led_pin || 18;
const LED_BLINK_TIME = 1000;
const MOUNTPOINT = "/media/usbstick";

let ledSuccess;
let ledProgress;
let ledError;
try {
  ledSuccess = new Gpio(SUCCESS_LED_PIN, "out");
  ledProgress = new Gpio(PROGRESS_LED_PIN, "out");
  ledError = new Gpio(ERROR_LED_PIN, "out");
} catch (err) {
  console.error("GPIO pins not available");
}

onMount(async drive => {
  if (!drive.isUSB) {
    return;
  }
  setProgressLED(true);
  if (drive.mountpoints.length <= 0) {
    if (process.platform === "linux") {
      console.log("No mountpoints - mounting");
      try {
        await mount(drive.device, MOUNTPOINT);
        drive.mountpoints.push({ path: MOUNTPOINT });
        console.log(`Mounted to ${MOUNTPOINT}`);
      } catch (err) {
        console.error(`Mounting failed: ${err}`);
        setProgressLED(false);
        showErrorLED();
        return;
      }
    } else {
      console.error("No mountpoints");
      setProgressLED(false);
      showErrorLED();
      return;
    }
  }
  console.log(`Drive '${drive.mountpoints[0].path}' connected`);
  let success;
  try {
    await copyFiles(drive.mountpoints[0].path);
    success = true;
  } catch (err) {
    console.error(err);
    success = false;
  }

  if (process.platform === "linux") {
    unmount(MOUNTPOINT)
      .then(() => {
        console.log("Unmounted drive");
      })
      .catch(err => {
        console.error(`Failed to unmount drive: '${err}'`);
      });
  }

  if (success) {
    setProgressLED(false);
    showSuccessLED();
  } else {
    setProgressLED(false);
    showErrorLED();
  }
});

// Let all LEDs blink on startup
showSuccessLED();
showProgressLED();
showErrorLED();

console.log(`Waiting for drives to be connected`);

function copyFiles(copyPath) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(DATA_PATH)) {
      reject(`The path '${DATA_PATH}' does not exist`);
    }

    let destination = createFolderPath(copyPath);

    console.log(`Copying files to '${destination}'`);

    fs.mkdirSync(destination);
    fs.copy(DATA_PATH, destination)
      .then(() => {
        console.log(`Copied files to '${destination}'`);
        resolve();
      })
      .catch(err => {
        reject(err);
      });
  });
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

function showProgressLED() {
  if (!ledProgress) {
    return;
  }

  ledProgress.writeSync(1);
  setTimeout(() => {
    ledProgress.writeSync(0);
  }, LED_BLINK_TIME);
}

function setProgressLED(enabled) {
  if (!ledProgress) {
    return;
  }

  ledProgress.writeSync(enabled ? 1 : 0);
}
