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
 * Class for watching for advertisments packets from
 * Yeelight devices.
 */
var Watch = function (_EventEmitter) {
  _inherits(Watch, _EventEmitter);

  /**
   * Constructor
   */
  function Watch() {
    _classCallCheck(this, Watch);

    var _this = _possibleConstructorReturn(this, (Watch.__proto__ || Object.getPrototypeOf(Watch)).call(this));

    _this.socket = _dgram2.default.createSocket('udp4');
    return _this;
  }

  /**
   * Start listening for advertisments packets from Yeelight
   * devices. Emits `message` event on response.
   */


  _createClass(Watch, [{
    key: 'watch',
    value: function watch() {
      var _this2 = this;

      this.socket.on('error', function () {
        return _this2.emit('error');
      });

      this.socket.on('listening', function () {
        return _this2.emit('listening');
      });

      this.socket.on('message', function (msg) {
        return _this2.emit('message', msg);
      });

      this.socket.bind(1982, function () {
        return _this2.socket.addMembership('239.255.255.250');
      });
    }

    /**
     * Stop watching
     */

  }, {
    key: 'stop',
    value: function stop() {
      this.socket.close();
    }
  }]);

  return Watch;
}(_events2.default);

exports.default = Watch;
module.exports = exports['default'];