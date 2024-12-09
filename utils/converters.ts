export const splitRowsByNewLine = (input: string): string[] => {
  return input.split("\n");
};

export const splitStringBySpaces = (input: string): string[] => {
  return input.split(/[ ]+/);
};

export const getNumberDifference = (a: number, b: number): number => {
  return Math.abs(a - b);
};

export const reverseString = (str: string) => str.split("").reverse().join("");

export const createGrid = (input: string) => {
  return input.split("\n").map((row) => row.split(""));
};

export const createMapCopy = (grid: string[][]) => {
  return grid.map((innerArray) => [...innerArray]);
};

// Transform the grid into a string
export const stringifyMap = (grid: string[][]) => {
  return grid.map((xAxis) => xAxis.join("")).join("\n");
};
