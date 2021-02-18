export interface Cell {
  color: string;
  emote?: string;
  cheer?: boolean;
}

export interface CellMap {
  [key: string]: Cell
}

