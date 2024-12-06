import { getAllRegexMatches } from "../../utils/get-all-regex-matches.ts";
import fs from "node:fs";
import path from "node:path";

const test_data =
  "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))";
const test_2 =
  "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))";

const input = fs.readFileSync(path.resolve("./days/3/input.txt"), "utf-8");

const mulRegex = new RegExp(/mul\((\d{1,3}),(\d{1,3})\)/g);

// Input is a random string
export function phaseOne(input: string): number {
  let total = 0;
  const matches = getAllRegexMatches(input, mulRegex);

  matches.forEach((match) => {
    const firstNumber = Number(match[1]);
    const secondNumber = Number(match[2]);

    total += firstNumber * secondNumber;
  });

  return total;
}

export function phaseTwo(input: string): number {
  let allowMul = true;
  let total = 0;
  // Split all the strings into string[] by do() and don't()
  const splitString = input.split(/(do\(\))|(don\'t\(\))/g);

  splitString.forEach((stringPart) => {
    if (stringPart === `don't()`) {
      allowMul = false;
    }

    if (stringPart === `do()`) {
      allowMul = true;
    }

    if (stringPart !== `do()` && stringPart !== `don't()`) {
      if (allowMul) {
        const matches = getAllRegexMatches(stringPart, mulRegex);

        matches.forEach((match) => {
          const firstNumber = Number(match[1]);
          const secondNumber = Number(match[2]);

          total += firstNumber * secondNumber;
        });
      }
    }
  });

  return total;
}

console.log(phaseTwo(input));
