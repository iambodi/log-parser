const fs = require('fs').promises;
const { parseFile } = require('./parseFile');
const version = require('./package.json').version;

const argv = process.argv;

async function fileChecker(file) {
  try {
    const stat = await fs.lstat(file);

    if (stat.isFile()) {
      return true;
    } else if (!stat.isFile()) {
      console.error('Please provide a file');
    } else {
      console.error('Please provide a valid file');
    }
  } catch (error) {
    console.error('An error occured while reading file');
  }
}

(async function main() {
  try {
    if (argv.length >= 4) {
      const isFile = await fileChecker(argv[3]);

      if (argv[2] === '--input' && isFile) {
        if (argv[4] === '--aggregate') {
          if (argv[5]) {
            if (argv[5] === '1m' || argv[5] === '5m' || argv[5] === '10m') {
              parseFile(argv[3], argv[5]);
            } else {
              console.error(`${argv[5]} is not a valid argument`);
            }
          } else {
            console.error('Please provide desired interval for aggregate');
          }
        } else if (argv[4] === '--version') {
          //Print package.json : version
          console.log(version);
        } else if (
          argv[4] !== undefined &&
          argv[4] !== ('--aggregate' || '--version')
        ) {
          console.error('Please provid a valid argumentda');
        } else {
          parseFile(argv[3], null);
        }
      } else if (argv[2] !== '--input') {
        console.log(argv[2]);

        console.error('Please provide a valid argument');
      } else if (!isFile) {
        console.error('Please provide a file');
      } else {
        console.error('Please retry');
      }
    } else {
      console.error('Please provide at least one argument and a valid file');
    }
  } catch (error) {
    console.error('error: Please follow instructions');
  }
})();
