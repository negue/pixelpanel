export class Options {
  _options = {};

  constructor() {
    var optionsArray = location.search.substr(1).split('&');
    var options = {};
    optionsArray.forEach(entry => {
      const [key, value] = entry.split('=');
      options[key] = value;
    });

    console.info({options});

    // todo add interface
    this._options = Object.assign({
      direction: 'column',
      cellSize: '40px',
      cellGap: '5px',
      cells: 420,
      channel: '',
      shadow: false,
      delay: 300,
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
}
