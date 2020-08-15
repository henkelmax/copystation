# USB Copy Station ![GitHub issues](https://img.shields.io/github/issues-raw/henkelmax/copystation) ![GitHub release (latest by date)](https://img.shields.io/github/v/release/henkelmax/copystation)

Turns your Raspberry PI into a copy station.

This also works for Windows and Linux, but the status LEDs will only work with the Raspberry PIs [GPIO](https://www.raspberrypi.org/documentation/usage/gpio/) pins.

## Prerequisites

### For Windows

``` cmd
npm install --global --production windows-build-tools
```

### For Linux

#### Install node

```sh
sudo apt-get update -y

sudo apt-get install -y curl software-properties-common

curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -

sudo apt-get install -y nodejs npm

sudo npm install --global yarn
```

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
`-h`, `--help` | Show help and exit. | -
`-p PATH`, `--path PATH` | The path to the files that are getting copied | `./data/`
`-f FOLDER_NAME`, `--folder-name FOLDER_NAME` | The name of the folder that the files are copied to | `data`
`-s PIN`, `--success-led-pin PIN` | The pin ID of the success LED | `17`
`-P PIN`, `--progress-led-pin PIN` | The pin ID of the progress LED | `27`
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

## Autostart with systemd

Create a file `/etc/systemd/system/usb-copy.service`

``` service
[Unit]
Description=USB Copy
After=network.target

[Service]
User=root
Environment=
WorkingDirectory=/usb-copy/
ExecStart=/usr/bin/node index.js --path "./data" --folder-name "data"

[Install]
WantedBy=multi-user.target
```

``` sh
sudo systemctl daemon-reload
sudo systemctl enable usb-copy
sudo systemctl start usb-copy
```
