/* @flow */

import net from 'net';
import querystring from 'querystring';
import url from 'url';
import Logger from './logger';

/**
 * Represents a Yeelight device
 */
class Device {
  id: number;
  address: string;
  port: string;
  counter: number;
  commands: Array<Object>;
  logger: Logger;

  /**
   * Constructor
   */
  constructor(payload: { id: ?number, address: ?string, port: ?string, verbose: ?boolean}) {
    if (!payload.address) {
      throw new TypeError('Missing required parameters: address');
    }
    this.id = payload.id || 1;
    this.commands = [];
    this.counter = 1;
    this.address = payload.address;
    this.port = payload.port || '55443';
    this.logger = new Logger({ enabled: payload.verbose || false });
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
      verbose: false,
    });
  }

  /**
   * Send command to device
   */
  sendCommand(command: Object): Promise<> {
    return new Promise((resolve, reject) => {
      const newCommand = command;
      if (undefined === command.id) {
        newCommand.id = this.counter + 1;
        this.commands.push(newCommand);
      }

      const stringified = JSON.stringify(newCommand);
      this.logger.info(`Send: ${stringified}`);

      const socket = new net.Socket();
      socket.connect(
        { port: this.port, host: this.address },
        () => socket.write(`${stringified}\r\n`),
      );

      socket.on('error', (err) => {
        socket.destroy();
        reject(err);
      });

      socket.setTimeout(10000, () => {
        socket.destroy();
        reject('Timeout');
      });

      socket.on('data', (data) => {
        const string = data.toString('utf8');
        this.logger.info(`Received: "${string}"`);
        const lines = string.split('\n');

        lines.forEach((line: string) => {
          const response = this.unserialize(line);
          if (!response) {
            reject(`Not a JSON reposponse : ${line}`);
            return;
          }
          if (response.method !== undefined && response.method === 'props') {
            return;
          }

          socket.end();

          if (response.id === newCommand.id) {
            this.commands = this.commands.filter(comm => comm.id !== response.id);
            resolve(response.result);
          } else {
            reject(`id missmatch: ${response.id} != ${command.id} in ${line}`);
          }
        });
      });
    });
  }

  unserialize(string: string) {
    let result;
    try {
      result = JSON.parse(string);
    } catch (e) {
      return null;
    }
    return result;
  }

  /**
   * Power on/off the device
   */
  powerOn(effect: string = 'smooth', duration: number = 500): Promise<> {
    return this.sendCommand({ method: 'set_power', params: ['on', effect, duration] });
  }

  powerOff(effect: string = 'smooth', duration: number = 500): Promise<> {
    return this.sendCommand({ method: 'set_power', params: ['off', effect, duration] });
  }

  getProp(props: Array<string>): Promise<> {
    return this.sendCommand({ method: 'get_prop', params: props }, false);
  }

  setCtAbx(ctValue: number, effect: string = 'smooth', duration: number = 500): Promise<> {
    return this.sendCommand({ method: 'set_ct_abx', params: [ctValue, effect, duration] });
  }

  setRgb(rgbValue: number, effect: string = 'smooth', duration: number = 500): Promise<> {
    return this.sendCommand({ method: 'set_rgb', params: [rgbValue, effect, duration] });
  }

  setHsv(hue: number, sat: number, effect: string = 'smooth', duration: number = 500): Promise<> {
    return this.sendCommand({ method: 'set_hsv', params: [hue, sat, effect, duration] });
  }

  setBright(brightness: number, effect: string = 'smooth', duration: number = 500): Promise<> {
    return this.sendCommand({ method: 'set_bright', params: [brightness, effect, duration] });
  }

  powerOnAndSetBright(brightness: number, effect: string = 'smooth', duration: number = 500): Promise<> {
    const device = this;
    return device.powerOn().then(() => device.setBright(brightness, effect, duration));
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
