import { writable } from 'svelte/store';
import * as tmi from 'tmi.js';

export class Twitch {
  newPixel$ = writable(null);

  _channelName = '';

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

    const lastMessageByUser = {
      // [key:username] = date
    };

    client.on('message', (channel, tags, message, self) => {
      const userName = tags['username'];
      // console.log(`${tags['display-name']}: ${message}`);
      // console.info({channel, tags, message, self});

      // todo !pixel add COLOR
      if (message.includes('!pixel:add')) {
        const lastMessage =  lastMessageByUser[userName];

        if (lastMessage) {
          const now = new Date();
          var dif = now.getTime() - lastMessage.getTime();

          if (dif < 10000) {
            return;
          }
        }

        const newPixelCmd = (message || '').replace("!", "");
        // console.info('TWITCH MESSAGE', message);
        this.newPixel$.set(newPixelCmd);

        lastMessageByUser[userName] = new Date();
      }

    });
  }

  // change limiter

}
