/* @flow */

import net from 'net';
import querystring from 'querystring';
import url from 'url';
import Logger from './logger';

/**
 * Represents a Yeelight device
 */
class Device {

  address: string;
  port: string;
  counter: integer;
  commands: Array<Object>
  logger: Logger

  /**
   * Constructor
   */
  constructor(payload: { address: ?string, port: ?string, verbose: ?boolean}) {
    if (!payload.address) {
      throw new TypeError('Missing required parameters: address');
    }
    if (!payload.port) {
      throw new TypeError('Missing required parameters: port');
    }

    this.commands = [];
    this.counter = 1;
    this.address = payload.address;
    this.port = payload.port;
    this.logger = new Logger({ enabled: payload.verbose });
  }

  /**
   * Create a Device instance from a raw message
   */
  static createDeviceFromMessage(msg: Buffer): Device {
    const message = querystring.parse(msg.toString('utf8'), '\r\n', ':');

    const urlObject = url.parse(message.Location);

    return new Device({
      id: message.id,
      address: urlObject.hostname,
      port: urlObject.port,
    });
  }

  /**
   * Send command to device
   */
  sendCommand(command: Object): Promise<> {
    return new Promise((resolve, reject) => {

      if (undefined == command.id) {
        command.id = this.counter++;
        this.commands.push(command);
      }

      const stringified = JSON.stringify(command);
      this.logger.info(`Send: ${stringified}`);

      var socket = new net.Socket();
      socket.setTimeout(1000);
      socket.connect(
        { port: this.port, host: this.address },
        () => socket.write(`${stringified}\r\n`),
      );

      socket.on('data', (data) => {
        const string = data.toString('utf8');
        this.logger.info(`Received: ${string}`);
        const response = this.unserialize(string);

        if(!response) {
          this.logger.info(`Not a JSON response ${string}`);
          return;
        }

        if (response.method != undefined && "props" == response.method) {
          return;
        }

        socket.end();

        if (response.id == command.id) {
          this.commands = this.commands.filter((command) => command.id != response.id);
          resolve(response.result);
        } else {
          reject(`id missmatch: ${response.id} != ${command.id} in ${string}`);
        }

        socket.on('error', (err) => {
          this.logger.info(`Error ${err}`);
          reject(err);
        });

        socket.on('timeout', () => {
          var command = this.commands[0];
          console.log(this.commands);
          this.logger.info(`Timeout, resend ${command}`);
          this.sendCommand(command);
        });
      });
    });
  }

  unserialize(string: string) {
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
  powerOn(effect: string = "smooth", duration: number = 500): Promise<> {
    return this.sendCommand({ method: 'set_power', params: ["on", effect, duration] });
  }

  powerOff(effect: string = "smooth", duration: number = 500): Promise<> {
    return this.sendCommand({ method: 'set_power', params: ["off", effect, duration] });
  }

  getProp(props: Array<string>): Promise<> {
    return this.sendCommand({ method: 'get_prop', params: props }, false);
  }

  setCtAbx(ctValue: number, effect: string, duration: number): Promise<> {
    return this.sendCommand({ method: 'set_ct_abx', params: [ctValue, effect, duration] });
  }

  setRgb(rgbValue: number, effect: string, duration: number): Promise<> {
    return this.sendCommand({ method: 'set_rgb', params: [rgbValue, effect, duration] });
  }

  setHsv(hue: number, sat: number, effect: string, duration: number): Promise<> {
    return this.sendCommand({ method: 'set_hsv', params: [hue, sat, effect, duration] });
  }

  setBright(brightness: number, effect: string = "smooth", duration: number = 500): Promise<> {
    return this.sendCommand({ method: 'set_bright', params: [brightness, effect, duration] });
  }

  powerOnAndSetBright(brightness: number, effect: string = "smooth", duration: number = 500): Promise<> {
    var device = this;
    return device.powerOn().then(() => {
      return device.setBright(brightness, effect, duration);
    });
  }

  toggle(): Promise<> {
    return this.sendCommand({ method: 'toggle', params: [] });
  }

  default(): Promise<> {
    return this.sendCommand({ method: 'default', params: [] });
  }

  startCf(count: number, action: number, flowExpression: string): Promise<> {
    return this.sendCommand({ method: 'start_cf', params: [count, action, flowExpression] });
  }

  stopCf(): Promise<> {
    return this.sendCommand({ method: 'stop_cf', params: [] });
  }

  setScene(name: string, val1: number, val2: number, val3: number): Promise<> {
    return this.sendCommand({ method: 'set_scene', params: [name, val1, val2, val3] });
  }

  cronAdd(type: number, value: number): Promise<> {
    return this.sendCommand({ method: 'cron_add', params: [type, value] });
  }

  cronGet(type: number): Promise<> {
    return this.sendCommand({ method: 'cron_get', params: [type] });
  }

  cronDel(type: number): Promise<> {
    return this.sendCommand({ method: 'cron_del', params: [type] });
  }

  setAdjust(action: string, prop: string): Promise<> {
    return this.sendCommand({ method: 'set_adjust', params: [action, prop] });
  }

  setMusic(action: number, host: string, port: number): Promise<> {
    return this.sendCommand({ method: 'set_music', params: [action, host, port] });
  }

  setName(name: string): Promise<> {
    return this.sendCommand({ method: 'set_name', params: [name] });
  }
}

export default Device;
