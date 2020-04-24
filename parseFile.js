const fs = require('fs');
const { parseTime } = require('./aggregate');
const {
  dateRegex,
  requestTypeRegex,
  statusCodeRegex,
  responseTimeRegex,
  urlRegex,
} = require('./utils/regex');

function getTimestamp(fullDate) {
  let timestamp = Date.parse(fullDate.replace(/\:/, ' '));
  timestamp = timestamp / 1000;
  return timestamp;
}

function parseLine(line) {
  const date = line.match(dateRegex);
  const timestamp = getTimestamp(date[0]);
  const requestType = line.match(requestTypeRegex);
  const statusCode = line.match(statusCodeRegex);
  const url = line.match(urlRegex);
  let responseTime = line.match(responseTimeRegex);

  responseTime = responseTime[0].split('"')[1];

  let obj = {
    timestamp: timestamp,
    request_type: requestType[0].trim(),
    status_code: parseInt(statusCode[0].trim(), 10),
    'response_time​': parseFloat(responseTime),
    url: url[0].trim(),
  };
  return obj;
}
// change name function
function getParsedLine(array) {
  let tab = [];

  array.forEach((line) => {
    if (line && line !== '') {
      let parsedLine = parseLine(line);
      tab.push(parsedLine);
    }
  });
  return tab;
}

exports.parseFile = async function parseFile(file, argv) {
  let array = [];
  try {
    await fs.readFile(file, (err, data) => {
      if (err) throw err;
      array = data.toString().split('\n');

      let parsedFile = getParsedLine(array);
      let str = JSON.stringify(parsedFile);
      let json = JSON.parse(str);
      if (argv) {
        parseTime(json, argv);
      } else {
        console.log(json);
      }
    });
  } catch (error) {
    console.error('error: ', error);
  }
};
