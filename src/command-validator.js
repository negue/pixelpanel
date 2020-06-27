import * as importStuff from "validate-color";

// either svelte or validate-color is broken
// need this hack to the named exports...
const {
  validateHTMLColorName,
  validateHTMLColorSpecialName,
  validateHTMLColorHex
} = importStuff['__moduleExports'];

const SPECIAL_NAMES = [
  'me', 'random'
];

function validatePixelColors(color) {
  if (SPECIAL_NAMES.includes(color)) {
    return true;
  }

  if (validateHTMLColorName(color)
    || !validateHTMLColorSpecialName(color)
    || !validateHTMLColorHex(color))
  {
    return true;
  }

  return false;
}


export class CommandValidator {
  parseCommand (message, username, tags) {
    const containsCommand = message.startsWith('!pixel');

    if (!containsCommand) {
      return null;
    }

    const result = {
      action: '',
      value: '',
      badges: tags.badges,
      username
    };

    // !pixel:add=color
    if (message.includes('=') && message.includes(':')) {
      const [commandPair, value] = message.split('=');
      const [command, action] = commandPair.split(':');

      result.action  = action;
      result.value = value;
    } else {
      // !pixel add color
      // remove !pixel
      const commandWithoutPrefix = message.replace('!pixel', '').trim();

      // split spaces
      const [action, value] = commandWithoutPrefix.split(' ');

      result.action  = action;
      result.value = value;
    }

    if (result.action === 'add') {

      if (!validatePixelColors(result.value)) {
        return false;
      }

      if (result.value === 'me') {
        result.value = tags.color;
      }

      // check if emotes available and add
      if (tags.emotes) {
        const emotes = Object.keys(tags.emotes);
        if (emotes.length > 0) {
          result.value = {
            color: result.value,
            emote: emotes[0]
          };
        }
      }
    }

    return result;
  }
}
