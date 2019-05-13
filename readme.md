# USB Copy

## Prerequisites

### For Windows
``` cmd
npm install --global --production windows-build-tools
```

### For Raspbian

Install usbmount
``` sh
sudo apt-get install -y usbmount
```

Edit the file `usbmount.conf`

``` sh
sudo nano /etc/usbmount/usbmount.conf
```

and replace the line

``` sh
FS_MOUNTOPTIONS=""
```

with

``` sh
FS_MOUNTOPTIONS="- fstype = vfat, gid = users, dmask = 0007, fmask = 0117"
```

and reboot

``` sh
sudo reboot
```


[Source](http://www.kalitut.com/2017/11/mount-unmount-usb-usbmount.html)

<!-- https://raspberrypi.stackexchange.com/questions/41959/automount-various-usb-stick-file-systems-on-jessie-lite -->

#### NTFS support

``` sh
sudo apt-get install -y ntfs-3g
```

## Usage

``` sh
node index.js [-h] [-p PATH] [-f FOLDER_NAME]
```

Argument | Description | Default
--- | --- | ---
`-h`, `--help ` | Show help and exit. | -
`-p PATH`, `--path PATH` | The path to the files that are getting copied | `./data/`
`-f FOLDER_NAME`, `--folder-name FOLDER_NAME` | The name of the folder that the files are copied to | `data`
`-s PIN`, `--success-led-pin PIN` | The pin ID of the success LED | `17`
`-e PIN`, `--error-led-pin PIN` | The pin ID of the error LED | `18`

### Examples

``` sh
node index.js --path "./data" --folder-name "data"

node index.js -p "./data" -f "data"
```

### Running with [nodemon](https://www.npmjs.com/package/nodemon)

``` sh
yarn dev --path "./data" --folder-name "data"
```