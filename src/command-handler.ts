// TODO NEED Typescript

import {stringToObject} from "./utils";
import { Command, validatePixelColors } from "./command-validator";

export class CommandHandler {
  _pixelz = null;

  constructor(pixelz) {
    this._pixelz = pixelz;
  }

  lastMessageByUser = {};

  canExecute(command: Command) {
    console.info({command});

    if (command.badges && command.badges.broadcaster === "1") {
      return true;
    }

    if (command.value.cheer) {
      return true;
    }

    // only allowed by the broadcaster
    if (command.action === 'cleanup') {
      return false;
    }

    // extract to handler
    const lastMessage =  this.lastMessageByUser[command.username];

    if (lastMessage) {
      const now = new Date();
      var dif = now.getTime() - lastMessage.getTime();

      if (dif < 10000) {
        return false;
      }
    }

    this.lastMessageByUser[command.username] = new Date();

    return true;
  }

  async handle (command) {
    if (!this.canExecute(command)) {
      return false;
    }
    const {action, value} = command;

    console.info({action, value});

    switch (action) {
      case "add": {
        this._pixelz.addPixel(value);
        break;
      }
      case "cleanup": {
        // get all cells
        const allCells = await this._pixelz.loadPixels();

        const objectifiedCells = stringToObject(allCells);

        // go through and see if those are valid
        const keysOfCells = Object.keys(objectifiedCells);
        const invalidCellIndexArray = [];

        const cellArray = [];

        keysOfCells.forEach(key => {
          const cell = objectifiedCells[key];

          const isValid = validatePixelColors(cell.color);

          if (!isValid) {
            invalidCellIndexArray.push(key);
          }

          cellArray.push(cell);
        });

        // remove the invalid ones
        for (const invalidKey of invalidCellIndexArray.reverse()) {
          cellArray.splice(+invalidKey, 1);
        }

        const newPixelsObject = {};

        for (let i = 0; i< cellArray.length; i++) {
          newPixelsObject[i] = cellArray[i];
        }

        console.info({newPixelsObject});
        // update and save
        this._pixelz.updatePixels(newPixelsObject);

        break;
      }
    }
  }
}
