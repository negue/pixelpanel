import { writable } from 'svelte/store';
import * as tmi from 'tmi.js';
import {CommandValidator} from "./command-validator";

export class Twitch {
  commandReceived$ = writable(null);

  _channelName = '';

  _commandValidator = new CommandValidator();


  constructor(channelName) {
    this._channelName = channelName;

    const client = new tmi.Client({
      connection: {
        secure: true,
        reconnect: true
      },
      channels: [ channelName ]
    });

    console.info({channelName});

    client.connect();

    client.on('message', (channel, tags, message, self) => {
      const userName = tags['username'];
      // console.log(`${tags['display-name']}: ${message}`);
      console.info({channel, tags, message, self});

      const command = this._commandValidator.parseCommand(message, userName, tags);

      this.commandReceived$.set(command);
    });
  }

  // change limiter

}
