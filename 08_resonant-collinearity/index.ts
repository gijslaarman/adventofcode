import { Coordinate } from "../types.d.ts";
import { Grid } from "../utils/grid.ts";

type AntennaCollection = Record<string, Coordinate[]>;

const extractAntennas = (grid: Grid): AntennaCollection => {
  const antennaCollection: Record<string, { x: number; y: number }[]> = {};

  grid.loopThroughGrid((cell, x, y) => {
    if (cell !== ".") {
      if (antennaCollection[cell]) {
        antennaCollection[cell].push({ x, y });
      } else {
        antennaCollection[cell] = [{ x, y }];
      }
    }
  });

  return antennaCollection;
};

const getAntiNodes = (
  grid: Grid,
  [antenna, antennaToCompare]: Coordinate[],
) => {
  const { x: xDiff, y: yDiff } = grid.getDifferenceBetweenCoordinates(
    antenna,
    antennaToCompare,
  );

  const antiNodeOne = grid.moveCoordinate(antenna, {
    x: xDiff,
    y: yDiff,
  });
  // Do the reverse steps for the compared antenna
  const antiNodeTwo = grid.moveCoordinate(antennaToCompare, {
    x: -xDiff,
    y: -yDiff,
  });

  return [antiNodeOne, antiNodeTwo];
};

const getAntiNodesLine = (
  grid: Grid,
  [antenna, antennaToCompare]: Coordinate[],
) => {
  const { x: xDiff, y: yDiff } = grid.getDifferenceBetweenCoordinates(
    antenna,
    antennaToCompare,
  );
  let positiveRow = true;
  let negativeRow = true;

  let current = { x: antenna.x, y: antenna.y };
  const antiNodes = [current];

  while (positiveRow) {
    current = grid.moveCoordinate(current, { x: xDiff, y: yDiff });

    if (grid.isOutOfBounds(current)) {
      positiveRow = false;
      break;
    }

    antiNodes.push(current);
  }

  while (negativeRow) {
    current = grid.moveCoordinate(current, { x: -xDiff, y: -yDiff });

    if (grid.isOutOfBounds(current)) {
      negativeRow = false;
      break;
    }

    antiNodes.push(current);
  }

  return antiNodes;
};

const findAllNodesFromAntennaCollection = (
  grid: Grid,
  antennas: Coordinate[],
  createLines = false,
) => {
  const antiNodes = new Set<string>();

  /**
   * @returns Boolean - is node added boolean
   */
  const addNode = (node: Coordinate): boolean => {
    if (grid.isOutOfBounds(node)) return false;
    antiNodes.add(`${node.x},${node.y}`);
    return true;
  };

  antennas.forEach((antenna, index) => {
    const remainingAntennas = antennas.slice(index + 1);

    remainingAntennas.forEach((antennaToCompare) => {
      if (createLines) {
        const foundNodes = getAntiNodesLine(grid, [antenna, antennaToCompare]);

        foundNodes.forEach(addNode);
      } else {
        const foundNodes = getAntiNodes(grid, [antenna, antennaToCompare]);

        foundNodes.forEach(addNode);
      }
    });
  });

  return antiNodes;
};

export const solvePart1 = (input: string) => {
  const grid = new Grid(input);
  const antennaCollection = extractAntennas(grid);
  let antiNodesSet = new Set<string>();

  // Check per letter on the grid where the anti-nodes are placed.
  for (const antennaName in antennaCollection) {
    const antiNodes = findAllNodesFromAntennaCollection(
      grid,
      antennaCollection[antennaName],
    );

    antiNodesSet = antiNodesSet.union(antiNodes);
  }

  return Array.from(antiNodesSet).length;
};

// This is not needed, It only needs to create lines, not spawn new nodes from the anti-nodes.
// const findRecursiveAntiNodes = (grid: Grid, antennas: Coordinate[]) => {
//   const antiNodes = new Set<string>();

//   const recursiveHelper = (currentAntennas: Coordinate[]) => {
//     if (currentAntennas.length < 2) return;

//     currentAntennas.forEach((antenna, index) => {
//       const remainingAntennas = currentAntennas.slice(index + 1);
//       console.log({ antenna, remainingAntennas });

//       remainingAntennas.forEach((antennaToCompare) => {
//         const foundNodes = getAntiNodes(grid, [antenna, antennaToCompare]);

//         foundNodes.forEach((node) => {
//           if (grid.isOutOfBounds(node)) return;

//           const nodeKey = `${node.x},${node.y}`;
//           if (!antiNodes.has(nodeKey)) {
//             antiNodes.add(nodeKey);
//             recursiveHelper([...currentAntennas, node]);
//           }
//         });
//       });
//     });
//   };

//   recursiveHelper(antennas);

//   return antiNodes;
// };

export const solvePart2 = (input: string) => {
  const grid = new Grid(input);
  const antennaCollection = extractAntennas(grid);
  let antiNodesSet = new Set<string>();

  // Check per letter on the grid where the anti-nodes are placed.
  for (const antennaName in antennaCollection) {
    const antiNodes = findAllNodesFromAntennaCollection(
      grid,
      antennaCollection[antennaName],
      true,
    );

    antiNodesSet = antiNodesSet.union(antiNodes);
  }

  const array = Array.from(antiNodesSet);

  grid.loopThroughGrid((cell, x, y) => {
    if (array.includes(`${x},${y}`) && cell === ".") {
      grid.grid[y][x] = "#";
    }
  });

  console.log(grid.stringify());

  return Array.from(antiNodesSet).length;
};
