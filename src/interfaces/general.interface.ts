export interface MoveDirectionI {
  x: 0 | 1 | -1;
  y: 0 | 1 | -1;
}
export interface MoveRangenI {
  min: {
    x: number;
    y: number;
  },
  max: {
    x: number;
    y: number;
  }
}