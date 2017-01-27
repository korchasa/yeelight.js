'use strict';

var Device = require('../lib/yeelight').Device;

const device = new Device({
  id: '1234',
  address: '192.168.1.228',
  port: '55443',
  verbose: true
});

device
  .powerOnAndSetBright(50)
  .then(() => {
    setTimeout(() => device.powerOff(), 1000)
  })
  .catch((err) => console.log('err set 1', err));
