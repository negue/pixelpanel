<script lang="ts">
  import {_range} from "./_range";
  import {Options} from "./options";
  import {Twitch} from './twitch';
  import {PixelState} from "./pixel.state";
  import {CommandHandler} from "./command-handler";
  import {stringToObject, getRandomRgb} from "./utils";
  import {Cell} from './interfaces';

  const options = new Options();

  const cellDirection = options.getDirection();
  const cellSize = options.getCellSize();
  const cellGap = options.getCellGap();
  const shadow = options.getShadow();
  const delayAmount = options.getAnimationDelay(); // in ms

  const twitch = new Twitch(options.getChannel());

  const pixelz = new PixelState(options.getCells());
  const commandHandler = new CommandHandler(pixelz);

  twitch.commandReceived$.subscribe(command =>  {
    if (!command) {
      return;
    }

    commandHandler.handle(command);
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

    const newValues = stringToObject(value);

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
      <div style="background: {(cellValues[i] && cellValues[i].color) || 'inherited'}; --animate-delay: {i*delayAmount}ms;"
           data-index="{i}"
           class="cell {(cellValues[i] && cellValues[i].color)} {shadow && 'shadow'}">
        {#if (cellValues[i] && cellValues[i].emote != null)}
          <img src="https://static-cdn.jtvnw.net/emoticons/v1/{cellValues[i].emote}/2.0"
               alt="an emote, no name available sorry">
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

    transition: all 1s, background-color 2s;

    img {
      width: calc(var(--cell-size) - 5px);
      height: calc(var(--cell-size) - 5px);
      object-fit: contain;
    }
	}

  .cell.shadow {
    box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.45);
  }

  .random {
    background-image: -webkit-linear-gradient(92deg, #f35626, #feab3a);
    animation: hue 4s infinite linear;
    animation-delay: var(--animate-delay);
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
