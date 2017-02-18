'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Represents a Yeelight device
 */
var Device = function () {

  /**
   * Constructor
   */
  function Device(payload) {
    _classCallCheck(this, Device);

    if (!payload.address) {
      throw new TypeError('Missing required parameters: address');
    }
    this.commands = [];
    this.counter = 1;
    this.address = payload.address;
    this.port = payload.port || 55443;
    this.logger = new _logger2.default({ enabled: payload.verbose });
  }

  /**
   * Create a Device instance from a raw message
   */


  _createClass(Device, [{
    key: 'sendCommand',


    /**
     * Send command to device
     */
    value: function sendCommand(command) {
      var _this = this;

      return new Promise(function (resolve, reject) {

        if (undefined == command.id) {
          command.id = _this.counter++;
          _this.commands.push(command);
        }

        var stringified = JSON.stringify(command);
        _this.logger.info('Send: ' + stringified);

        var socket = new _net2.default.Socket();
        socket.connect({ port: _this.port, host: _this.address }, function () {
          return socket.write(stringified + '\r\n');
        });

        socket.on('error', function (err) {
          socket.destroy();
          reject(err);
        });

        socket.setTimeout(10000, function () {
          socket.destroy();
          reject('Timeout');
        });

        socket.on('data', function (data) {
          var string = data.toString('utf8');
          _this.logger.info('Received: ' + string);
          var response = _this.unserialize(string);

          if (!response) {
            reject('Not a JSON');
            return;
          }

          if (response.method != undefined && "props" == response.method) {
            return;
          }

          socket.end();

          if (response.id == command.id) {
            _this.commands = _this.commands.filter(function (command) {
              return command.id != response.id;
            });
            resolve(response.result);
          } else {
            reject('id missmatch: ' + response.id + ' != ' + command.id + ' in ' + string);
          }
        });
      });
    }
  }, {
    key: 'unserialize',
    value: function unserialize(string) {
      try {
        var result = JSON.parse(string);
      } catch (e) {
        return null;
      }
      return result;
    }

    /**
     * Power on/off the device
     */

  }, {
    key: 'powerOn',
    value: function powerOn() {
      var effect = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "smooth";
      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;

      return this.sendCommand({ method: 'set_power', params: ["on", effect, duration] });
    }
  }, {
    key: 'powerOff',
    value: function powerOff() {
      var effect = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "smooth";
      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;

      return this.sendCommand({ method: 'set_power', params: ["off", effect, duration] });
    }
  }, {
    key: 'getProp',
    value: function getProp(props) {
      return this.sendCommand({ method: 'get_prop', params: props }, false);
    }
  }, {
    key: 'setCtAbx',
    value: function setCtAbx(ctValue, effect, duration) {
      return this.sendCommand({ method: 'set_ct_abx', params: [ctValue, effect, duration] });
    }
  }, {
    key: 'setRgb',
    value: function setRgb(rgbValue, effect, duration) {
      return this.sendCommand({ method: 'set_rgb', params: [rgbValue, effect, duration] });
    }
  }, {
    key: 'setHsv',
    value: function setHsv(hue, sat, effect, duration) {
      return this.sendCommand({ method: 'set_hsv', params: [hue, sat, effect, duration] });
    }
  }, {
    key: 'setBright',
    value: function setBright(brightness) {
      var effect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "smooth";
      var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 500;

      return this.sendCommand({ method: 'set_bright', params: [brightness, effect, duration] });
    }
  }, {
    key: 'powerOnAndSetBright',
    value: function powerOnAndSetBright(brightness) {
      var effect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "smooth";
      var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 500;

      var device = this;
      return device.powerOn().then(function () {
        return device.setBright(brightness, effect, duration);
      });
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      return this.sendCommand({ method: 'toggle', params: [] });
    }
  }, {
    key: 'default',
    value: function _default() {
      return this.sendCommand({ method: 'default', params: [] });
    }
  }, {
    key: 'startCf',
    value: function startCf(count, action, flowExpression) {
      return this.sendCommand({ method: 'start_cf', params: [count, action, flowExpression] });
    }
  }, {
    key: 'stopCf',
    value: function stopCf() {
      return this.sendCommand({ method: 'stop_cf', params: [] });
    }
  }, {
    key: 'setScene',
    value: function setScene(name, val1, val2, val3) {
      return this.sendCommand({ method: 'set_scene', params: [name, val1, val2, val3] });
    }
  }, {
    key: 'cronAdd',
    value: function cronAdd(type, value) {
      return this.sendCommand({ method: 'cron_add', params: [type, value] });
    }
  }, {
    key: 'cronGet',
    value: function cronGet(type) {
      return this.sendCommand({ method: 'cron_get', params: [type] });
    }
  }, {
    key: 'cronDel',
    value: function cronDel(type) {
      return this.sendCommand({ method: 'cron_del', params: [type] });
    }
  }, {
    key: 'setAdjust',
    value: function setAdjust(action, prop) {
      return this.sendCommand({ method: 'set_adjust', params: [action, prop] });
    }
  }, {
    key: 'setMusic',
    value: function setMusic(action, host, port) {
      return this.sendCommand({ method: 'set_music', params: [action, host, port] });
    }
  }, {
    key: 'setName',
    value: function setName(name) {
      return this.sendCommand({ method: 'set_name', params: [name] });
    }
  }], [{
    key: 'createDeviceFromMessage',
    value: function createDeviceFromMessage(msg) {
      var message = _querystring2.default.parse(msg.toString('utf8'), '\r\n', ':');

      var urlObject = _url2.default.parse(message.Location);

      return new Device({
        id: message.id,
        address: urlObject.hostname,
        port: urlObject.port
      });
    }
  }]);

  return Device;
}();

exports.default = Device;
module.exports = exports['default'];