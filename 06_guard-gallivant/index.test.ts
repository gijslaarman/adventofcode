import { expect } from "jsr:@std/expect";
import { solvePart1, solvePart2 } from "./index.ts";
import { testWrapper } from "../utils/misc.ts";

const fileInput = Deno.readTextFileSync("./06_guard-gallivant/input.txt");
const exampleInput = `
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
`.trim();

testWrapper("Day 06", () => {
  Deno.test.ignore("Part 1 - Example input", async () => {
    const result = await solvePart1(exampleInput);

    expect(result).toEqual(41);
  });

  Deno.test.ignore("Part 1 - File input", async () => {
    const result = await solvePart1(fileInput);
    expect(result).toEqual(5162);
  });

  Deno.test("Part 2 - Example input", async () => {
    const result = await solvePart2(exampleInput);
    expect(result).toEqual(6);
  });

  Deno.test("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(1909);
  });
});
