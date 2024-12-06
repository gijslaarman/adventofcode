export const getAllRegexMatches = (
  input: string,
  regex: RegExp,
): RegExpExecArray[] => {
  const matches: RegExpExecArray[] = [];
  let result;

  while ((result = regex.exec(input)) !== null) {
    matches.push(result);
  }

  return matches;
};
