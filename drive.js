const drivelist = require('drivelist');

module.exports = async (callback, interval = 1000) => {
    let lastDrives = await drivelist.list();

    setInterval(async () => {
        let drives = await drivelist.list();
        let newDrives = diff(lastDrives, drives);
        if (newDrives.length > 0) {
            newDrives.forEach(drive => {
                callback(drive);
            });
        }
        lastDrives = drives;
    }, interval);
}


function diff(drive1, drive2) {
    let diff = [];
    for (let i = 0; i < drive2.length; i++) {
        let drive = drive1.find(element => {
            return element.device === drive2[i].device;
        });

        if (drive === undefined) {
            diff.push(drive2[i]);
        }
    }
    return diff;
}