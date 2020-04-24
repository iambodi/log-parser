const dateRegex = /\d{2}\/[a-zA-Z]+\/\d{4}\:\d{2}\:\d{2}\:\d{2}\s\+\d{4}/;
const requestTypeRegex = /[A-Z]{3,6}/;
const statusCodeRegex = /\s\d{3}\s/;
const responseTimeRegex = /\"\d{1,2}\.\d{3}\"/;
const urlRegex = /\s\/[^\s|?|\/]+[^\s?\/]/;

exports.dateRegex = dateRegex;
exports.requestTypeRegex = requestTypeRegex;
exports.statusCodeRegex = statusCodeRegex;
exports.responseTimeRegex = responseTimeRegex;
exports.urlRegex = urlRegex;
