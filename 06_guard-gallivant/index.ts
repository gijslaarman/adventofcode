import { createGrid } from "../utils/converters.ts";

const ALLOWED_PATHS = ["^", ".", "X", "-", "|", "+", "S", "N", "W", "E"];

const getStartingPosition = (
  grid: string[][],
  identifier: string,
): Coordinate | undefined => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === identifier) {
        return { x, y };
      }
    }
  }

  return undefined;
};

const walkGrid = (
  currentCoordinate: Coordinate,
  direction: "top" | "right" | "bottom" | "left",
): Coordinate => {
  let { x, y } = currentCoordinate;

  switch (direction) {
    case "top":
      y -= 1;
      break;
    case "right":
      x += 1;
      break;
    case "bottom":
      y += 1;
      break;
    case "left":
      x -= 1;
      break;
  }

  return { x, y };
};

// Always turn right
const turnDirection = (
  currentDirection: WalkingDirection,
): WalkingDirection => {
  switch (currentDirection) {
    case "top":
      return "right";
    case "right":
      return "bottom";
    case "bottom":
      return "left";
    case "left":
      return "top";
  }
};

type Coordinate = { x: number; y: number };
type WalkingDirection = "top" | "right" | "bottom" | "left";

const getNextStepItem = (
  currentPosition: Coordinate,
  direction: WalkingDirection,
  grid: string[][],
) => {
  try {
    const nextPosition = walkGrid(currentPosition, direction);
    const itemValue = grid[nextPosition.y][nextPosition.x];

    if (itemValue === undefined) throw Error("Out of bounds");

    return itemValue;
  } catch (error) {
    return "end";
  }
};

// Transform the grid into a string
const createMap = (grid: string[][]) => {
  return grid.map((xAxis) => xAxis.join("")).join("\n");
};

const createMapCopy = (grid: string[][]) => {
  return grid.map((innerArray) => [...innerArray]);
};

const walkThroughGrid = (grid: string[][], startingPosition: Coordinate) => {
  const walkedTilesSet = new Set<string>();
  let currentDirection: WalkingDirection = "top";
  let currentPosition: Coordinate = startingPosition;
  let hasExitedGrid = false;
  let isLoop = false;
  let steps = 0;

  // Add starting position
  const markedWalkingPath = [...grid];

  const mapWalkedPath = (x: number, y: number) => {
    const thisPosition = markedWalkingPath[y][x];
    walkedTilesSet.add(`${x},${y}`);

    if (thisPosition === ".") {
      switch (currentDirection) {
        case "top":
        case "bottom":
          markedWalkingPath[y][x] = "|";
          break;
        case "right":
        case "left":
          markedWalkingPath[y][x] = "-";
      }
    }

    if (thisPosition === "|" || thisPosition === "-") {
      markedWalkingPath[y][x] = "+";
    }
  };

  // Add starting position
  walkedTilesSet.add(`${currentPosition.x},${currentPosition.y}`);

  // Step through the grid
  while (!hasExitedGrid && !isLoop) {
    const nextStepItem = getNextStepItem(
      currentPosition,
      currentDirection,
      grid,
    );

    if (nextStepItem === "end") {
      hasExitedGrid = true;
      break;
    }

    // Check if we are in a loop
    if (["S", "N", "W", "E"].includes(nextStepItem)) {
      switch (currentDirection) {
        case "top":
          if (nextStepItem === "S") {
            isLoop = true;
          }
          break;
        case "bottom":
          if (nextStepItem === "N") {
            isLoop = true;
          }
          break;
        case "right":
          if (nextStepItem === "W") {
            isLoop = true;
          }
          break;
        case "left":
          if (nextStepItem === "E") {
            isLoop = true;
            break;
          }
      }
    }

    if (isLoop) {
      continue;
    }

    // Hit a wall, turn
    if (nextStepItem === "#" || nextStepItem === "O") {
      const currentTileStanding = grid[currentPosition.y][currentPosition.x];

      if (!["S", "N", "W", "E"].includes(currentTileStanding)) {
        // Mark the entry point of the turn with the direction we came from
        switch (currentDirection) {
          case "top":
            markedWalkingPath[currentPosition.y][currentPosition.x] = "S";
            break;
          case "bottom":
            markedWalkingPath[currentPosition.y][currentPosition.x] = "N";
            break;
          case "right":
            markedWalkingPath[currentPosition.y][currentPosition.x] = "W";
            break;
          case "left":
            markedWalkingPath[currentPosition.y][currentPosition.x] = "E";
        }
      }

      currentDirection = turnDirection(currentDirection);
    }

    // We can walk
    if (ALLOWED_PATHS.includes(nextStepItem)) {
      currentPosition = walkGrid(currentPosition, currentDirection);
      mapWalkedPath(currentPosition.x, currentPosition.y);
      steps++;
    }
  }

  return {
    steps: Array.from(walkedTilesSet).length,
    markedWalkingPath,
    isLoop,
  };
};

export const solvePart1 = async (input: string) => {
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

export const solvePart2 = async (input: string) => {
  const walkingGrid = createGrid(input);
  const startingPosition = getStartingPosition(walkingGrid, "^");
  let loops = 0;
  const promises = [];

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
        promises.push(walkThroughGrid(newGrid, startingPosition));
      }
    }
  }

  return loops;
};
