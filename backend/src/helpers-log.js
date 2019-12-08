const { createLogger, format, transports } = require('winston');
const { combine, label, json } = format;

/**
 * Логирование
 * @Info http://learn.javascript.ru/screencast/nodejs#nodejs-dev-log
 * @param module Путь откуда пришло
 * @returns {*}
 */
module.exports = function getLogger(module) {

  const path = module.filename.split('/').slice(-3).join('/');

  return createLogger({
    transports:[
      new transports.File({
        level: 'info',
        filename: 'backend.log',
        format: combine(
          label({ label: path }),
          format.timestamp(),
          format.printf( ({ level, message, label, timestamp }) => {
            return `${level}: path: ${label}   message: ${message} `;
          }),
          // format.json(),
        ),
      }),
      new transports.Console({
        level: 'silly',
        format: combine(
          label({ label: path }),
          format.timestamp(),
          format.colorize({ all: true, error: 'red' }),
          format.printf( ({ level, message, label, timestamp }) => {
            return `${level}: [${label}]   message: ${message} `;
          })
        ),
      })
    ]
  });

};
