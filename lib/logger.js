'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Logger class
 */
var Logger = function () {

  /**
   * Constructor
   */
  function Logger(options) {
    _classCallCheck(this, Logger);

    this.options = Object.assign({
      enabled: true
    }, options);
    this.logger = new _winston2.default.Logger({
      transports: [new _winston2.default.transports.Console({
        timestamp: true
      })]
    });
  }

  /**
   * Log an info message
   */


  _createClass(Logger, [{
    key: 'info',
    value: function info(msg) {
      if (!this.options.enabled) {
        return;
      }
      this.logger.info(msg);
    }
  }]);

  return Logger;
}();

exports.default = Logger;
module.exports = exports['default'];