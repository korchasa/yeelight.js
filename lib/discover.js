'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dgram = require('dgram');

var _dgram2 = _interopRequireDefault(_dgram);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Discover Yeelight devices on demand
 */
var Discover = function (_EventEmitter) {
  _inherits(Discover, _EventEmitter);

  /**
   * Constructor
   */
  function Discover() {
    _classCallCheck(this, Discover);

    var _this = _possibleConstructorReturn(this, (Discover.__proto__ || Object.getPrototypeOf(Discover)).call(this));

    _this.socket = _dgram2.default.createSocket('udp4');
    _this.message = new Buffer('M-SEARCH * HTTP/1.1\r\nHOST:239.255.255.250:1982\r\nMAN:"ssdp:discover"\r\nST:wifi_bulb\r\n');
    return _this;
  }

  /**
   * Start discovery of Yeelight Devices. It will send a multicast message
   * and wait for response. Emits `message` event on response.
   */


  _createClass(Discover, [{
    key: 'discover',
    value: function discover() {
      var _this2 = this;

      this.socket.on('message', function (msg, rinfo) {
        return _this2.emit('message', msg, rinfo);
      });

      this.socket.on('error', function () {
        return _this2.emit('error');
      });

      this.socket.on('listening', function () {
        return _this2.emit('listening');
      });

      this.socket.bind(43210, '0.0.0.0', function () {
        return _this2.onBind();
      });
    }
  }, {
    key: 'onBind',
    value: function onBind() {
      this.socket.send(this.message, 0, this.message.length, 1982, '239.255.255.250');
    }

    /**
     * Stop discovery
     */

  }, {
    key: 'stop',
    value: function stop() {
      this.socket.close();
    }
  }]);

  return Discover;
}(_events2.default);

exports.default = Discover;
module.exports = exports['default'];