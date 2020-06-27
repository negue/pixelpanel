<script>
  import {_range} from "./_range";
  import {Options} from "./options";
  import  {Twitch} from './twitch';
  import {PixelState} from "./pixel.state";
  import {CommandValidator} from "./command-validator";
  import {CommandHandler} from "./command-handler";

  const options = new Options();

  const cellDirection = options.getDirection();
  const cellSize = options.getCellSize();
  const cellGap = options.getCellGap();

  const twitch = new Twitch(options.getChannel());

  const pixelz = new PixelState(options.getCells());
  const commandHandler = new CommandHandler();

  twitch.commandReceived$.subscribe(command =>  {
    if (!command) {
      return;
    }

    if (!commandHandler.canExecute(command)) {
      return;
    }

    const {action, value} = command;

    if (action === 'add') {
      pixelz.addPixel(value);
    }
    // console.info('NEW PIXEL:', {value});
  })

  const cellValues$ = pixelz.pixelStore$;

 //  value

  let maxCells = options.getCells();
  let currentCell = 0; // to add

  function increaseByThen() {
    maxCells += 10;
  }

  // Key = Index, Value any color

  function fillRandomColors() {
    cellValues$.update(value => {
      for (let i = 0; i < maxCells; i++) {
        value[i] = getRandomRgb();
      }


      return value; // todo refactor
    })
  }

  function getRandomRgb() {
    var num = Math.round(0xffffff * Math.random());
    var r = num >> 16;
    var g = num >> 8 & 255;
    var b = num & 255;
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
  }

  // TODO clean up
  function moveColorsByOne () {
    // 0 to 1
    // 1 to 2
    cellValues$.update(value => {
      for (let i = maxCells; i >= 0; i--) {
        value[i + 1] = value[i];
      }

      return value; // todo refactor
    });
  }

  function fillNewCellWithColor() {
    moveColorsByOne();
    cellValues$.update(value => {
      value[0] = getRandomRgb();

      return value; // todo refactor
    });
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async function rainbow() {
    for (let i = 0; i < maxCells; i++) {
      fillNewCellWithColor();
      await sleep(50);
    }
  }




  let cellValues = {};

  const unsubscribe = cellValues$.subscribe(value => {
    if (!value) {
      return;
    }

    console.info({value});
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
    })

    cellValues = newValues;
  });

  async function _initAll () {
    await pixelz.init();
    // console.warn('ADD RANDOM');
    // pixelz.addPixel('pixel:add=random');
  }

  _initAll();
</script>

<main>
 <!--
  <button on:click={fillNewCellWithColor}>
    New Color
  </button>

  <button on:click={rainbow}>
    Fill Random after a time
  </button>

  <button on:click={increaseByThen}>
    Add 10 Cells
  </button>

  <button on:click={fillRandomColors}>
    Fill randomv
  </button>

  { maxCells }
-->
  <div class="cell-holder {cellDirection}"
       style="--cell-size: {cellSize}; --cell-gap: {cellGap}"
  >

    {#each _range(0, maxCells, 1) as i}
      <div style="background: {(cellValues[i] && cellValues[i].color) || 'inherited'}"
           class="cell {(cellValues[i] && cellValues[i].color)}">
        {#if (cellValues[i] && cellValues[i].emote != null)}
          <img src="https://static-cdn.jtvnw.net/emoticons/v1/{cellValues[i].emote}/4.0">
        {/if}
      </div>
    {/each}

  </div>
</main>

<style lang="scss">
  .row {
    flex-direction: row;
  }

  .column {
    flex-direction: column;
  }

	.cell-holder {
    display: flex;
    flex-wrap: wrap;
    min-height: 450px;
    width: 90%;
    max-height: 85vh;
    align-content: flex-start;
	}

	.cell {
		background: gray;
		width: var(--cell-size, 40px);
		height: var(--cell-size, 40px);

		margin-right: var(--cell-gap, 5px);
		margin-bottom: var(--cell-gap, 5px);

    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: calc(var(--cell-size) - 5px);
      height: calc(var(--cell-size) - 5px);
      object-fit: contain;
    }
	}

  .random {
    background-image: -webkit-linear-gradient(92deg, #f35626, #feab3a);
    -webkit-animation: hue 4s infinite linear;
  }

  @-webkit-keyframes hue {
    from {
      -webkit-filter: hue-rotate(0deg);
    }

    to {
      -webkit-filter: hue-rotate(360deg);
    }
  }
</style>
