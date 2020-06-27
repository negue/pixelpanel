# Pixel Panel

Query Params: `https://negue.github.io/pixelpanel/?OPTION=VALUE&OPTION=VALUE`

| Option  |  | |
|---|---|---|
| `cells`  |  Amount of Cells |  420 |
|  `direction` | `column` / `row` TODO rename?   | `column` |
|  `channel` | Twitch Chanel Name  | `''` |
|  `cellSize` | Size    |`40px`  |
|  `cellGap` | Gap between Cells    |`5px` |

## Commands

`!pixel:add=COLOR` <br>
`!pixeladd COLOR` <br>
`!pixeladd COLOR Emote` like "PogChamp"


COLOR is:
- a fixed CSS name
- a RGB VALUE (#RRGGBB)
- or special colors:
  - random, which is hue shifting
  - me (selected color of the chatter)
