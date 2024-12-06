/**
 * Create an object for easy lookup of the rules.
 * @example Output: {
 *   2: [1, 3], Where 2 always needs to be before the numbers 1 and 3
 * }
 */

const createRuleBook = (rules: string) => {
  const rulesArray = rules.split("\n").map((rule) =>
    rule.split("|").map((number) => +number)
  );

  return rulesArray.reduce(
    (indice: { [key: number]: number[] }, rule) => {
      const [pageNumber, beforePageRuleNumber] = rule;

      if (!indice[pageNumber]) {
        indice[pageNumber] = [beforePageRuleNumber];
      } else {
        indice[pageNumber].push(beforePageRuleNumber);
      }
      return indice;
    },
    {},
  );
};
type RuleBook = ReturnType<typeof createRuleBook>;

const createPagesArray = (pages: string) => {
  return pages.split("\n").map((page) =>
    page.split(",").map((number) => +number)
  );
};
type PagesArray = ReturnType<typeof createPagesArray>;

const getPagesSorted = (
  pages: PagesArray,
  ruleBook: RuleBook,
) => {
  const pagesInRightOrder: Array<number[]> = [];
  const pagesInWrongOrder: Array<number[]> = [];

  pages.forEach((pageLine) => {
    let isRightOrder = true;

    pageLine.forEach((pageNumber, index, array) => {
      const ruleSet: number[] | undefined = ruleBook[pageNumber];
      const pageNumbersBeforeThisNumber = array.slice(0, index);

      // This number doesn't have a ruleset
      if (ruleSet === undefined) return;

      // If any number in the ruleset includes any of the remaining numbers in the page, then it's not in the right order
      if (ruleSet?.some((rule) => pageNumbersBeforeThisNumber.includes(rule))) {
        isRightOrder = false;
      }
    });

    if (isRightOrder) {
      pagesInRightOrder.push(pageLine);
    } else {
      pagesInWrongOrder.push(pageLine);
    }
  });

  return {
    pagesInRightOrder,
    pagesInWrongOrder,
  };
};

const findMiddleNumber = (pages: number[]) => {
  return pages[Math.round(pages.length / 2) - 1]; // Arrays start at 0 so we need to subtract 1
};

export const solvePart1 = (input: string) => {
  const [rules, pages] = input.split("\n\n");

  const ruleBook = createRuleBook(rules);
  const pagesArray = createPagesArray(pages);

  const { pagesInRightOrder } = getPagesSorted(pagesArray, ruleBook);

  let count = 0;
  pagesInRightOrder.forEach((pages) => {
    count += findMiddleNumber(pages);
  });

  return count;
};

export const solvePart2 = (input: string) => {
  const [rules, pages] = input.split("\n\n");

  const ruleBook = createRuleBook(rules);
  const pagesArray = createPagesArray(pages);

  const { pagesInWrongOrder } = getPagesSorted(pagesArray, ruleBook);

  const rightOrderedPages = pagesInWrongOrder.map((pages) => {
    // Sort pages in right order of the rulebook
    return pages.sort((a, b) => {
      if (ruleBook[a]?.includes(b)) return -1;
      if (ruleBook[b]?.includes(a)) return 1;
      return 0;
    });
  });

  let count = 0;
  rightOrderedPages.forEach((pages) => {
    count += findMiddleNumber(pages);
  });

  return count;
};
