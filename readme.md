# USB Copy

## Prerequisites

### For Windows
``` cmd
npm install --global --production windows-build-tools
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

### Examples

``` sh
node index.js --path "./data" --folder-name "data"

node index.js -p "./data" -f "data"
```

### Running with [nodemon](https://www.npmjs.com/package/nodemon)

``` sh
yarn dev --path "./data" --folder-name "data"
```