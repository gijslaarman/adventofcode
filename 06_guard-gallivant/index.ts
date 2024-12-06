import { createGrid } from "../utils/converters.ts";
import {
  createMapCopy,
  getStartingPosition,
  stringifyMap,
} from "./map.utils.ts";
import { walkThroughGrid } from "./walk-grid.ts";

export const solvePart1 = (input: string) => {
  const walkingGrid = createGrid(input);
  const startingPosition = getStartingPosition(walkingGrid, "^");

  if (!startingPosition) {
    throw Error("Could not find starting position");
  }

  const { steps } = walkThroughGrid(
    createMapCopy(walkingGrid),
    startingPosition,
  );

  return steps;
};

export const solvePart2 = (input: string) => {
  const walkingGrid = createGrid(input);
  const startingPosition = getStartingPosition(walkingGrid, "^");
  let loops = 0;

  if (!startingPosition) {
    throw Error("Could not find starting position");
  }

  const { markedWalkingPath } = walkThroughGrid(
    createMapCopy(walkingGrid),
    startingPosition,
  );

  // Check for each position in the grid if placing an obstacle 'O' there would loop the guard.
  for (let y = 0; y < walkingGrid.length; y++) {
    for (let x = 0; x < walkingGrid[y].length; x++) {
      const thisPart = markedWalkingPath[y][x];
      const isPathPart = ["-", "|", "+", "S", "N", "W", "E"].includes(thisPart);

      if (isPathPart) {
        const newGrid = createMapCopy(walkingGrid);
        newGrid[y][x] = "O";
        const { isLoop } = walkThroughGrid(newGrid, startingPosition);

        if (isLoop) loops++;
      }
    }
  }

  return loops;
};
