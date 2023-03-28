// 1 token ~= 4 chars in English
export const CHARS_IN_TOKEN = 4;

export const crudeTokenizer = (str: string): number => {
  return Math.floor(str.length / CHARS_IN_TOKEN);
};

export const charLengthToTokenLength = (charLength: number): number => {
  return Math.floor(charLength / CHARS_IN_TOKEN);
};

export const tokenLengthToCharLength = (tokenLength: number): number => {
  return tokenLength * CHARS_IN_TOKEN;
};
