'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Store = function () {
  function Store() {
    _classCallCheck(this, Store);

    if (new.target === Store) throw TypeError('new of abstract class Store');
  }

  _createClass(Store, null, [{
    key: 'add',
    value: function add() {
      throw TypeError('Please override `add` function on your store.');
    }
  }, {
    key: 'getById',
    value: function getById() {
      throw TypeError('Please override `getById` function on your store.');
    }
  }, {
    key: 'get',
    value: function get() {
      throw TypeError('Please override `get` function on your store.');
    }
  }]);

  return Store;
}();

exports.default = Store;
module.exports = exports['default'];