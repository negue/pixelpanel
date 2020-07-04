import { Cell } from './interfaces';
import * as importStuff from "validate-color";

// either svelte or validate-color is broken
// need this hack to get the named exports...
const {
  validateHTMLColorName,
  validateHTMLColorSpecialName,
  validateHTMLColorHex
} = importStuff['__moduleExports'];

const SPECIAL_NAMES = [
  'me', 'random'
];

export function validatePixelColors(color: string) {
  if (typeof color === 'undefined') {
    return false;
  }

  if (SPECIAL_NAMES.includes(color)) {
    return true;
  }

  if (validateHTMLColorName(color)
    || validateHTMLColorSpecialName(color)
    || validateHTMLColorHex(color))
  {
    return true;
  }

  return false;
}

interface Command {
  action: string;
  value: Cell;
  badges: any;
  username: string;
}

export class CommandValidator {
  parseCommand (message: string, username: string, tags: any): Command | null {
    const result: Command = {
      action: '',
      value: null,
      badges: tags.badges,
      username
    };

    const emotes = tags?.emotes
      ? Object.keys(tags.emotes)
      : [];

    console.info({emotes, message, tags})

    if (message.includes('!pixel')) {
      // !pixel:add=color
      if (message.includes(':')) {
        const [commandPair, value] = message.split('=');
        const [command, action] = commandPair.split(':');

        result.action = action;
        result.value = {
          color: value
        };
      } else {
        // !pixel add color
        // remove !pixel
        const commandWithoutPrefix = message.replace('!pixel', '').trim();

        // split spaces
        const [action, value] = commandWithoutPrefix.split(' ');

        result.action = action;
        result.value = {
          color: value
        };
      }
    } else {
      console.info({ emotes });
      if (emotes.length > 0) {
        // enable add mode
        result.action = 'add';
        // setting the color to "me"
        // so it can read the user's color
        result.value = {
          color: 'me'
        };

        console.info('Emote exist  :)', JSON.stringify(result));
      } else {
        return null;
      }
    }

    if (result.action === 'add') {
      if (!validatePixelColors(result.value.color)) {
        console.info('invalid', result.value);
        return null;
      }

      if (result.value.color === 'me') {
        console.info('setting tags color', tags);
        result.value = {
          color: tags.color
        };

        console.info('changed to result', JSON.stringify(result));
      }

      // check if emotes available and add
      if (emotes.length > 0) {
        result.value = {
          color: result.value.color,
          emote: emotes[0]
        };

        console.info('after emote added', JSON.stringify(result));
      }

    }

    return result;
  }
}
