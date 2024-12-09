function cartesianProduct<T>(arrays: T[][]): T[][] {
  return arrays.reduce<T[][]>(
    (acc, curr) => acc.flatMap((arr) => curr.map((item) => [...arr, item])),
    [[]],
  );
}

const OPERATORS = ["+", "*", "||"];

export const solvePart1 = (input: string) => {
  const equations = input.trim().split("\n");
  const equationsThatAreTrue: [number, number[]][] = [];

  for (const equation of equations) {
    const [totalString, numberString] = equation.split(":");
    const total = Number(totalString);
    const numbers = numberString.trim().split(" ").map(Number);

    const operatorSpots = numbers.length - 1;
    const combinations = cartesianProduct(Array(operatorSpots).fill(OPERATORS));

    const isTrue = combinations.some((combination) => {
      const equation = numbers.reduce((sum, number, index) => {
        if (index === 0) return number;
        const operator = combination[index - 1];
        return eval(`${sum} ${operator} ${number}`);
      });

      return equation === total;
    });

    if (isTrue) {
      equationsThatAreTrue.push([total, numbers]);
    }
  }

  const sum = equationsThatAreTrue.reduce((acc, [total]) => acc + total, 0);
  return sum;
};

export const solvePart2 = (input: string) => {
  const equations = input.trim().split("\n");
  const equationsThatAreTrue: [number, number[]][] = [];

  for (const equation of equations) {
    console.clear();
    console.log("%cCheck:", "color: blue", equation);
    const [totalString, numberString] = equation.split(":");
    const total = Number(totalString);
    const numbers = numberString.trim().split(" ").map(Number);

    const operatorSpots = numbers.length - 1;
    const combinations = cartesianProduct(Array(operatorSpots).fill(OPERATORS));

    const isTrue = combinations.some((combination) => {
      const equation = numbers.reduce((sum, number, index) => {
        if (index === 0) return number;
        const operator = combination[index - 1];

        if (operator === "||") {
          return Number(`${sum}${number}`); // Add the numbers together
        }

        return eval(`${sum} ${operator} ${number}`);
      });

      return equation === total;
    });

    if (isTrue) {
      console.log(`%c${total} is true for ${numbers}`, "color: green");
      equationsThatAreTrue.push([total, numbers]);
    }
  }

  const sum = equationsThatAreTrue.reduce((acc, [total]) => acc + total, 0);
  return sum;
};
