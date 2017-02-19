'use strict';

var Device = require('../lib/yeelight').Device;

const device = new Device({
  address: '192.168.1.232',
  verbose: true
});

device
  .powerOn().then(() => {
    device.setBright(1)
    .then(() => {
      device.getProp(['bright', 'power', 'ct', 'rgb']).then(console.log);
      setTimeout(() => device.powerOff(), 1000)
    })
  });
