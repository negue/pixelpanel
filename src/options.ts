export interface OptionsState {
  direction: string; // todo enum
  cellSize: string;
  cellGap: string;
  cells: number;
  channel: string;
  shadow: boolean;
  delay: number;
  ignoreUsers: string;
}

export class Options {
  _options: Partial<OptionsState> = {};

  constructor() {
    var optionsArray = location.search.substr(1).split('&');
    var options = {};
    optionsArray.forEach(entry => {
      const [key, value] = entry.split('=');
      options[key] = value;
    });

    console.info({options});

    this._options = Object.assign({
      direction: 'column',
      cellSize: '40px',
      cellGap: '5px',
      cells: 420,
      channel: '',
      shadow: false,
      delay: 300,
      ignoreUsers: ''
    }, options);
  }

  // refactor to use only fields/properties
  // instead of get-methods
  getDirection () {
    return this._options.direction;
  }

  getCellSize () {
    return this._options.cellSize;
  }

  getCellGap () {
    return this._options.cellGap;
  }

  getCells () {
    // convert to a number
    return +this._options.cells;
  }

  getChannel () {
    return this._options.channel;
  }

  getShadow() {
    return this._options.shadow;
  }

  getAnimationDelay() {
    return this._options.delay;
  }

  getIgnoredUsers() {
    return this._options.ignoreUsers;
  }
}
