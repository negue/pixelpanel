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

    this._options = Object.assign({
      direction: 'column',
      cellSize: '40px',
      cellGap: '5px',
      cells: 420,
      channel: ''
    }, options);
  }

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
}
