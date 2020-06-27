import { writable } from 'svelte/store';
import * as localforage from "localforage";

const PIXEL_STORAGE = 'pixels@v1';

export class PixelState {
  // return the observable
  pixelStore$ = writable(null);

  _cellCount = 0;

  constructor(cellCount) {
    this._cellCount = cellCount;
  }

  async init () {
    // console.warn('PRE LOAD');
    await this.loadPixels();
    // console.warn('POST LOAD');

    // save to localforage
    this.pixelStore$.subscribe(newValues  => {
      if (!newValues) {
        return;
      }

      console.info({newValues});
      localforage.setItem(PIXEL_STORAGE, newValues);
    });

  }

  async loadPixels () {
    const savedPixels = await localforage.getItem(PIXEL_STORAGE) || {};
    console.info({savedPixels});
    this.pixelStore$.set(savedPixels);

    return savedPixels;
  }

  // add another pixel
  addPixel (value) {
    this._insertPixel(value);
  }

  // todo refactor
  _insertPixel (colorOrEmote) {
    // console.warn('INSERT PIXEL', newColor);

    // 0 to 1
    // 1 to 2
    this.pixelStore$.update(value => {
      for (let i =  this._cellCount; i >= 0; i--) {
        value[i + 1] = value[i];
      }

      value[0] = colorOrEmote;

      return value;
    });
  }

  updatePixels (newObject) {
    this.pixelStore$.set(newObject);
  }
}
