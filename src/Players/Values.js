
// Value of each piece
export const pieceValues = {
  p: 9,
  n: 30,
  b: 32,
  r: 50,
  q: 90,
  k: 0,
}

// Value of each square for each piece
export const squareValues = {
  p: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [9, 9, 9, 9, 9, 9, 9, 9],
    [5, 5, 5, 5, 5, 5, 5, 5],
    [3, 3, 3, 4, 4, 3, 3, 3],
    [1, 0, 3, 4, 4, 3, 0, 1],
    [0, 0, 0, 2, 2, 0, 0, 0],
    [0, 0, 0, -4, -4, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  n: [
    [-5, -3, -3, -3, -3, -3, -3, -5],
    [-3, 1, 1, 1, 1, 1, 1, -3],
    [0, 3, 5, 5, 5, 5, 3, 0],
    [0, 3, 3, 3, 3, 3, 3, 0],
    [0, 0, 2, 2, 2, 2, 0, 0],
    [-2, 0, 0, 0, 0, 0, 0, -2],
    [-2, 0, 0, 0, 0, 0, 0, -2],
    [-5, -3, -3, -3, -3, -3, -3, -5],
  ],
  b: [
    [-3, 0, 0, 0, 0, 0, 0, -3],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 0, 0, 0, 0, 2, 0],
    [0, 0, 2, 0, 0, 2, 0, 0],
    [0, 1, 0, 1, 1, 0, 1, 0],
    [0, 2, 0, 0, 0, 0, 2, 0],
    [-3, -1, -1, -1, -1, -1, -1, -3],
  ],
  r: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [4, 4, 4, 4, 4, 4, 4, 4],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
  ],
  q: [
    [-2, 0, 0, 0, 0, 0, 0, -2],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [-2, -1, -1, -1, -1, -1, -1, -2],
  ],
  k: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 0, 1, 0, 10, 5],
  ],
}