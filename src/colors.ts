const enabled =
  process.env.NO_COLOR === undefined && process.env.FORCE_COLOR !== "0";

function wrap(code: number, resetCode: number) {
  return (text: string) =>
    enabled ? `\x1b[${code}m${text}\x1b[${resetCode}m` : text;
}

export const c = {
  // Colors
  green: wrap(32, 39),
  red: wrap(31, 39),
  yellow: wrap(33, 39),
  blue: wrap(34, 39),
  cyan: wrap(36, 39),
  magenta: wrap(35, 39),
  gray: wrap(90, 39),

  // Styles
  bold: wrap(1, 22),
  dim: wrap(2, 22),
  italic: wrap(3, 23),
  underline: wrap(4, 24),
};
