import { expect } from "jsr:@std/expect";
import { solvePart1, solvePart2 } from "./index.ts";
import { testWrapper } from "../utils/misc.ts";

const fileInput = Deno.readTextFileSync("./07_bridge-repair/input.txt");
const exampleInput = `
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
`.trim();

testWrapper("Day 07", () => {
  Deno.test.ignore("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(3749);
  });

  Deno.test.ignore("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(66343330034722);
  });

  Deno.test("Part 2 - Example input", () => {
    expect(solvePart2(exampleInput)).toEqual(11387);
  });

  Deno.test("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(0);
  });
});
