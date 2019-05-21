const { exec } = require("child_process");
const path = require("path");
const drivelist = require("drivelist");

module.exports.mount = (device, mountpoint) => {
  return new Promise(async (resolve, reject) => {
    let dev = path.normalize(device);
    let partitions = await getPartitions(dev);

    if (!partitions || partitions.length <= 0) {
      reject(`The device ${dev} has no partitions`);
      return;
    }

    exec(
      `mkdir -p "${mountpoint}" && mount "${
        partitions[0].name
      }" "${mountpoint}"`,
      async (err, stdout, stderr) => {
        if (err) {
          reject(err);
        }
        if (stderr) {
          reject(stderr);
        }

        await checkMounted(dev);
        resolve();
      }
    );
  });
};

module.exports.unmount = mountpoint => {
  return new Promise(async (resolve, reject) => {
    exec(`umount ${mountpoint}`, async (err, stdout, stderr) => {
      if (err) {
        reject(err);
      }
      if (stderr) {
        reject(stderr);
      }

      resolve();
    });
  });
};

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

async function checkMounted(device) {
  await pause(100);
  if (await isMounted(device)) {
    return true;
  }
  return checkMounted(device);
}

function isMounted(device) {
  return new Promise(async (resolve, reject) => {
    let dev = path.normalize(device);
    let drives = await drivelist.list();

    drives.forEach(element => {
      if (element.device === dev) {
        resolve(element.mountpoints.length > 0);
      }
    });

    resolve(false);
  });
}

function getPartitions(device) {
  return new Promise((resolve, reject) => {
    exec("lsblk --json --paths", (err, stdout, stderr) => {
      if (err) {
        reject(err);
        return;
      }
      let data = JSON.parse(stdout);
      data.blockdevices.forEach(element => {
        if (element.name === device) {
          resolve(element.children);
          return;
        }
      });
      reject("Device not found");
    });
  });
}
