export type Coordinate = { x: number; y: number };
export type WalkingDirection = "top" | "right" | "bottom" | "left";

export type ImpassibleGridPosition = typeof IMPASSIBLE_POSITIONS[number];
export type PassableGridPosition = typeof PASSABLE_POSITIONS[number];
export type AllGridPositions = ImpassibleGridPosition | PassableGridPosition;
export type CompassDirection = typeof COMPASS_DIRECTIONS[number];

// Guards cannot walk on these positions, and should turn to the right when they hit them.
export const IMPASSIBLE_POSITIONS = ["#", "O"] as const;
export const GUARD_STARTING_POSITION = "^" as const;
export const COMPASS_DIRECTIONS = ["N", "E", "S", "W"] as const;

// These are the allowed paths that the guard can walk on
export const PASSABLE_POSITIONS = [
  "^",
  ".",
  "X",
  "-",
  "|",
  "+",
  "S",
  "N",
  "W",
  "E",
] as const;

// export const ALLOWED_PATHS = ["^", ".", "X", "-", "|", "+", "S", "N", "W", "E"];

/**
 * Get the starting position of the grid
 * @param grid - Your input grid as a 2D array
 * @param identifier - The starting point identifier you are looking for
 * @returns `{ x , y } | undefined`
 */
export const getStartingPosition = (
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

/**
 * Get the next grid coordinate based on the current direction
 */
export const walkGrid = (
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
export const turnDirection = (
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

export const getnextStepPosition = (
  currentPosition: Coordinate,
  direction: WalkingDirection,
  grid: string[][],
): AllGridPositions | "end" => {
  try {
    const nextPosition = walkGrid(currentPosition, direction);
    const itemValue = grid[nextPosition.y][nextPosition.x];

    if (itemValue === undefined) throw Error("Out of bounds");

    return itemValue as AllGridPositions;
  } catch (_) {
    return "end";
  }
};

export const createMapCopy = (grid: string[][]) => {
  return grid.map((innerArray) => [...innerArray]);
};

// Transform the grid into a string
export const stringifyMap = (grid: string[][]) => {
  return grid.map((xAxis) => xAxis.join("")).join("\n");
};

export const guardHitAnObstacle = (nextStepPosition: AllGridPositions) => {
  return IMPASSIBLE_POSITIONS.includes(
    nextStepPosition as ImpassibleGridPosition,
  );
};
