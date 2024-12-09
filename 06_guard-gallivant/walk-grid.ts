import { createMapCopy } from "../utils/converters.ts";
import {
  AllGridPositions,
  COMPASS_DIRECTIONS,
  CompassDirection,
  type Coordinate,
  getnextStepPosition,
  guardHitAnObstacle,
  PASSABLE_POSITIONS,
  PassableGridPosition,
  turnDirection,
  walkGrid,
  type WalkingDirection,
} from "./map.utils.ts";

const isGuardInLoop = (
  currentDirection: WalkingDirection,
  nextStepPosition: AllGridPositions,
) => {
  // Map is marked with the direction we came from, if he's going into a turn from a direction he already came from, he's in a loop

  switch (currentDirection) {
    case "top":
      return nextStepPosition === "S";
    case "bottom":
      return nextStepPosition === "N";
    case "right":
      return nextStepPosition === "W";
    case "left":
      return nextStepPosition === "E";
  }
};

export const walkThroughGrid = (
  grid: string[][],
  startingPosition: Coordinate,
): { steps: number; markedWalkingPath: string[][]; isLoop: boolean } => {
  const walkedTilesSet = new Set<string>();
  let currentDirection: WalkingDirection = "top";
  let currentPosition: Coordinate = startingPosition;
  let hasExitedGrid = false;
  let isLoop = false;
  let steps = 0;

  const markedWalkingPath = createMapCopy(grid);

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

    // We already walked here, mark it as a crossroad
    if (thisPosition === "|" || thisPosition === "-") {
      markedWalkingPath[y][x] = "+";
    }
  };

  // Add starting position
  walkedTilesSet.add(`${currentPosition.x},${currentPosition.y}`);

  // Step through the grid
  while (!hasExitedGrid && !isLoop) {
    const nextStepPosition = getnextStepPosition(
      currentPosition,
      currentDirection,
      markedWalkingPath,
    );

    if (nextStepPosition === "end") {
      hasExitedGrid = true;
      break;
    }

    if (isGuardInLoop(currentDirection, nextStepPosition)) {
      isLoop = true;
      break;
    }

    if (guardHitAnObstacle(nextStepPosition)) {
      const currentTileStanding =
        markedWalkingPath[currentPosition.y][currentPosition.x];

      if (
        !COMPASS_DIRECTIONS.includes(currentTileStanding as CompassDirection)
      ) {
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
    if (
      PASSABLE_POSITIONS.includes(nextStepPosition as PassableGridPosition)
    ) {
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
