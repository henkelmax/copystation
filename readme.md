# USB Copy

## Prerequisites

### For Windows
``` cmd
npm install --global --production windows-build-tools
```

### For Linux

#### Install node

```sh
sudo apt-get install -y curl software-properties-common
curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -

sudo apt-get install -y nodejs

sudo npm install --global yarn
```

#### Install pm2

``` sh
sudo yarn global add pm2

# To run pm2 on startup
sudo pm2 startup
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

## Running with pm2

``` sh
sudo pm2 start index.js -- --path "./data" --folder-name "data"
```