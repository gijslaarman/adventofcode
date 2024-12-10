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

export const solvePart1 = (input: string) => {
  const grid = new Grid(input);
  const antennaCollection = extractAntennas(grid);
  const antiNodesSet = new Set<string>();

  for (const antennaName in antennaCollection) {
    const antennas = antennaCollection[antennaName];

    antennas.forEach((antenna, index) => {
      const remainingAntennas = antennas.slice(index + 1);

      remainingAntennas.forEach((antennaToCompare) => {
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

        [antiNodeOne, antiNodeTwo].forEach((node) => {
          if (!grid.isOutOfBounds(node)) {
            antiNodesSet.add(`${node.x},${node.y}`);
          }
        });
      });
    });
  }

  return Array.from(antiNodesSet).length;
};

export const solvePart2 = (input: string) => {
  return 0;
  // const [antennaCollection] = extractAntennas(input.trim());
  // const antiNodesSet = new Set<string>();
  // const grid = new Grid(input);

  // // Check per letter on the grid where the anti-nodes are placed.
  // for (const antennaGroup in antennaCollection) {
  //   const antennas = antennaCollection[antennaGroup];

  //   // Check for each antenna in the group where to place the anti-nodes.

  //   const antennaGroupAntiNodes = new Set(antennas);
  //   let allowLoop = true;

  //   // Since we are adding anti-nodes to the set, we need to check if the new anti-nodes spawn more anti-nodes.
  //   while (allowLoop) {
  //     antennas.forEach((antenna, _, array) => {
  //       const remainingAntennas = array.filter((t) => t !== antenna);

  //       remainingAntennas.forEach((antennaToCompare) => {
  //         const [antiNodeOne, antiNodeTwo] = getAntiNodesCoordinates(
  //           antenna,
  //           antennaToCompare,
  //         );

  //         console.log(antenna, antiNodeOne, antiNodeTwo);

  //         if (
  //           grid.isOutOfBounds(antiNodeOne) && grid.isOutOfBounds(antiNodeTwo)
  //         ) {
  //           allowLoop = false;
  //         }

  //         antennaGroupAntiNodes.add(antiNodeOne);
  //         antennaGroupAntiNodes.add(antiNodeTwo);
  //       });
  //     });
  //   }

  //   antiNodesSet.union(antennaGroupAntiNodes);
  // }

  // return Array.from(antiNodesSet).length;
};
