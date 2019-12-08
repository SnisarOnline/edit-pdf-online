const log = require('./helpers-log.js')(module);

exports.getAll = function (req, res) {
  log.info('exports.getAll: ', req);
};

exports.getOne = function (req, res) {
  log.info('exports.getAll: ', req);
};

exports.create = function (req, res) {
  console.log('exports.create: ', req);
};

exports.update = function (req, res) {
  console.log('exports.remove: ', update);
};

exports.remove = function (req, res) {
  console.log('exports.remove: ', req);
};


