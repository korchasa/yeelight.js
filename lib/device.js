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

    if (!payload.id) {
      throw new TypeError('Missing required parameters: id');
    }
    if (!payload.address) {
      throw new TypeError('Missing required parameters: address');
    }
    if (!payload.port) {
      throw new TypeError('Missing required parameters: port');
    }

    this.id = payload.id;
    this.address = payload.address;
    this.port = payload.port;
    this.socket = new _net2.default.Socket();
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
        var stringified = JSON.stringify(command);
        _this.socket.connect({
          port: _this.port,
          host: _this.address
        }, function () {
          return _this.socket.write(stringified + '\r\n');
        });

        _this.socket.on('data', function (data) {
          var response = JSON.parse(data.toString('utf8'));
          if (response.id !== _this.id) {
            _this.socket.destroy();
            resolve(response.result);
          } else {
            reject('id missmatch: ' + response.id + ' != ' + _this.id);
          }
        });

        _this.socket.on('error', function (err) {
          return reject(err);
        });
        _this.socket.on('close', function () {
          return resolve();
        });
      });
    }

    /**
     * Power on/off the device
     */

  }, {
    key: 'powerOn',
    value: function powerOn(power, effect, duration) {
      return this.sendCommand({ id: this.id, method: 'set_power', params: [power, effect, duration] });
    }
  }, {
    key: 'getProp',
    value: function getProp(props) {
      return this.sendCommand({ id: this.id, method: 'get_prop', params: props });
    }
  }, {
    key: 'setCtAbx',
    value: function setCtAbx(ctValue, effect, duration) {
      return this.sendCommand({ id: this.id, method: 'set_ct_abx', params: [ctValue, effect, duration] });
    }
  }, {
    key: 'setRgb',
    value: function setRgb(rgbValue, effect, duration) {
      return this.sendCommand({ id: this.id, method: 'set_rgb', params: [rgbValue, effect, duration] });
    }
  }, {
    key: 'setHsv',
    value: function setHsv(hue, sat, effect, duration) {
      return this.sendCommand({ id: this.id, method: 'set_hsv', params: [hue, sat, effect, duration] });
    }
  }, {
    key: 'setBright',
    value: function setBright(brightness, effect, duration) {
      return this.sendCommand({ id: this.id, method: 'set_bright', params: [brightness, effect, duration] });
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      return this.sendCommand({ id: this.id, method: 'toggle', params: [] });
    }
  }, {
    key: 'default',
    value: function _default() {
      return this.sendCommand({ id: this.id, method: 'default', params: [] });
    }
  }, {
    key: 'startCf',
    value: function startCf(count, action, flowExpression) {
      return this.sendCommand({ id: this.id, method: 'start_cf', params: [count, action, flowExpression] });
    }
  }, {
    key: 'stopCf',
    value: function stopCf() {
      return this.sendCommand({ id: this.id, method: 'stop_cf', params: [] });
    }
  }, {
    key: 'setScene',
    value: function setScene(name, val1, val2, val3) {
      return this.sendCommand({ id: this.id, method: 'set_scene', params: [name, val1, val2, val3] });
    }
  }, {
    key: 'cronAdd',
    value: function cronAdd(type, value) {
      return this.sendCommand({ id: this.id, method: 'cron_add', params: [type, value] });
    }
  }, {
    key: 'cronGet',
    value: function cronGet(type) {
      return this.sendCommand({ id: this.id, method: 'cron_get', params: [type] });
    }
  }, {
    key: 'cronDel',
    value: function cronDel(type) {
      return this.sendCommand({ id: this.id, method: 'cron_del', params: [type] });
    }
  }, {
    key: 'setAdjust',
    value: function setAdjust(action, prop) {
      return this.sendCommand({ id: this.id, method: 'set_adjust', params: [action, prop] });
    }
  }, {
    key: 'setMusic',
    value: function setMusic(action, host, port) {
      return this.sendCommand({ id: this.id, method: 'set_music', params: [action, host, port] });
    }
  }, {
    key: 'setName',
    value: function setName(name) {
      return this.sendCommand({ id: this.id, method: 'set_name', params: [name] });
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