import { Cell, CellMap } from './interfaces';
export function stringToObject (value: {[key: string]: Cell | string}): CellMap {
  const newValues = {};
  Object.keys(value).forEach(key =>{
    const valueOfKey = value[key];
    if (!valueOfKey) {
      return;
    }

    if (typeof valueOfKey === 'string') {
      newValues[key] = {
        color: valueOfKey
      };
    } else {
      newValues[key] = valueOfKey;
    }
  });

  return newValues;
}


export function getRandomRgb() : Cell {
  var num = Math.round(0xffffff * Math.random());
  var r = num >> 16;
  var g = num >> 8 & 255;
  var b = num & 255;
  return {
    color: 'rgb(' + r + ', ' + g + ', ' + b + ')'
  }
}
