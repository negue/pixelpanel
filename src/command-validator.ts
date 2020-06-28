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
  parseCommand (message, username, tags): Command {
    const containsCommand = message.startsWith('!pixel');

    if (!containsCommand) {
      return null;
    }

    const result: Command = {
      action: '',
      value: null,
      badges: tags.badges,
      username
    };

    // !pixel:add=color
    if (message.includes(':')) {
      const [commandPair, value] = message.split('=');
      const [command, action] = commandPair.split(':');

      result.action  = action;
      result.value = {
        color: value
      };
    } else {
      // !pixel add color
      // remove !pixel
      const commandWithoutPrefix = message.replace('!pixel', '').trim();

      // split spaces
      const [action, value] = commandWithoutPrefix.split(' ');

      result.action  = action;
      result.value = {
        color: value
      };
    }

    if (result.action === 'add') {

      if (!validatePixelColors(result.value.color)) {
        console.info('invalid', result.value);
        return null;
      }

      if (result.value.color === 'me') {
        result.value = tags.color;
      }

      // check if emotes available and add
      if (tags.emotes) {
        const emotes = Object.keys(tags.emotes);
        if (emotes.length > 0) {
          result.value = {
            color: result.value.color,
            emote: emotes[0]
          };
        }
      }
    }

    return result;
  }
}
