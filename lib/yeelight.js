'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Store = exports.Device = exports.Yeelight = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _device = require('./device');

var _device2 = _interopRequireDefault(_device);

var _memoryStore = require('./memoryStore');

var _memoryStore2 = _interopRequireDefault(_memoryStore);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _discover = require('./discover');

var _discover2 = _interopRequireDefault(_discover);

var _watch = require('./watch');

var _watch2 = _interopRequireDefault(_watch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Device manager for your Yeelight devices
 */
var Yeelight = function (_EventEmitter) {
  _inherits(Yeelight, _EventEmitter);

  /**
   * Constructor
   */
  function Yeelight(options) {
    _classCallCheck(this, Yeelight);

    var _this = _possibleConstructorReturn(this, (Yeelight.__proto__ || Object.getPrototypeOf(Yeelight)).call(this));

    _this.options = Object.assign({
      verbose: true
    }, options);

    _this.logger = new _logger2.default({ enabled: _this.options.verbose });
    _this.store = new _memoryStore2.default();
    _this.discovery = new _discover2.default();
    _this.watcher = new _watch2.default();
    return _this;
  }

  /**
   * Start the discovery of connected Yeelight devices. Return
   * devices found after `discoveryTimeout`.
   */


  _createClass(Yeelight, [{
    key: 'discover',
    value: function discover(discoveryTimeout) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.discovery.discover();

        _this2.discovery.on('message', function (msg) {
          return _this2.onReply(msg);
        });
        _this2.discovery.on('error', function () {
          return reject();
        });

        setTimeout(function () {
          resolve(_this2.store.get());
        }, discoveryTimeout);
      });
    }
  }, {
    key: 'onReply',
    value: function onReply(msg) {
      this.store.add(_device2.default.createDeviceFromMessage(msg));
    }

    /**
     * Start watching for advertisment packets of Yeelight devices.
     * Emits devices on `device` event.
     */

  }, {
    key: 'watch',
    value: function watch() {
      var _this3 = this;

      this.watcher.on('message', function (msg) {
        return _this3.onAdvertisment(msg);
      });
      this.watcher.watch();
    }

    /**
     * Stop watching
     */

  }, {
    key: 'stop',
    value: function stop() {
      this.watcher.stop();
    }
  }, {
    key: 'onAdvertisment',
    value: function onAdvertisment(msg) {
      var device = _device2.default.createDeviceFromMessage(msg);
      this.store.add(device);
      this.emit('device', device);
    }
  }]);

  return Yeelight;
}(_events2.default);

exports.Yeelight = Yeelight;
exports.Device = _device2.default;
exports.Store = _store2.default;