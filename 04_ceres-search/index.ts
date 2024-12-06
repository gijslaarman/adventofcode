const LOOK_UP_WORD = "XMAS";

const reverseString = (str: string) => str.split("").reverse().join("");

const createGrid = (input: string) => {
  return input.split("\n").map((row) => row.split(""));
};

export const solvePart1 = (input: string) => {
  let total = 0;
  const grid = createGrid(input),
    rowAmount = grid.length,
    columnAmount = grid[0].length;

  const getWord = (coords: [number, number][]) => {
    return coords.map(([x, y]) => grid[x]?.[y]).join("");
  };

  for (let y = 0; y < columnAmount; y++) {
    for (let x = 0; x < rowAmount; x++) { // Search from top left to bottom right.
      // For each letter in the grid we do a check for a word.
      const isHorizontalXmas = getWord([
        [x, y],
        [x, y + 1],
        [x, y + 2],
        [x, y + 3],
      ]);
      const isVerticalXmas = getWord([
        [x, y],
        [x + 1, y],
        [x + 2, y],
        [x + 3, y],
      ]);
      const isDiagonalLeftToRightXmas = getWord([
        [x, y],
        [x + 1, y + 1],
        [x + 2, y + 2],
        [x + 3, y + 3],
      ]);
      const isDiagonalRightToLeftXmas = getWord([
        [x + 3, y],
        [x + 2, y + 1],
        [x + 1, y + 2],
        [x, y + 3],
      ]);
      const isVerticalXmasReversed = reverseString(isVerticalXmas);
      const isHorizontalReversedXmas = reverseString(isHorizontalXmas);
      const isDiagonalLeftToRightXmasReversed = reverseString(
        isDiagonalLeftToRightXmas,
      );
      const isDiagonalRightToLeftXmasReversed = reverseString(
        isDiagonalRightToLeftXmas,
      );

      [
        isHorizontalXmas,
        isHorizontalReversedXmas,
        isVerticalXmas,
        isVerticalXmasReversed,
        isDiagonalLeftToRightXmas,
        isDiagonalLeftToRightXmasReversed,
        isDiagonalRightToLeftXmas,
        isDiagonalRightToLeftXmasReversed,
      ].forEach((potentialXmasWord) => {
        if (potentialXmasWord === LOOK_UP_WORD) {
          total++;
        }
      });
    }
  }

  return total;
};

export const solvePart2 = (input: string) => {
  let total = 0;
  const grid = createGrid(input),
    rowAmount = grid.length,
    columnAmount = grid[0].length;

  const getWord = (coords: [number, number][]) => {
    return coords.map(([x, y]) => grid[x]?.[y]).join("");
  };

  // Find MAS in the grid, but diagonal only. It needs to intersect with another MAS to form:
  /*
    M   M
      A
    S   S
  */
  for (let y = 0; y < columnAmount; y++) {
    for (let x = 0; x < rowAmount; x++) { // Search from top left to bottom right.
      const isDiagonalMas = getWord([
        [x, y],
        [x + 1, y + 1],
        [x + 2, y + 2],
      ]);
      const isDiagonalMasReversed = reverseString(isDiagonalMas);
      const isDiagonalMas2 = getWord([
        [x + 2, y],
        [x + 1, y + 1],
        [x, y + 2],
      ]);
      const isDiagonalMas2Reversed = reverseString(isDiagonalMas2);

      const isFirstMas = isDiagonalMas === "MAS" ||
        isDiagonalMasReversed === "MAS";
      const isSecondMas = isDiagonalMas2 === "MAS" ||
        isDiagonalMas2Reversed === "MAS";

      if (isFirstMas && isSecondMas) {
        total++;
      }
    }
  }

  return total;
};
