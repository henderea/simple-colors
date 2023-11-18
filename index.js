const tty = require('tty');

const _uniq = require('lodash/uniq');
const _flatten = require('lodash/flatten');
const _repeat = require('lodash/repeat');
const _stringSize = require('lodash/_stringSize');
const _createPadding = require('lodash/_createPadding');
const _isFunc = require('lodash/isFunction');
const _isObj = require('lodash/isPlainObject');
const _isNum = require('lodash/isNumber');
const _isStr = require('lodash/isString');

//#region stripAnsi
function makeAnsiRegex() {
  const pattern = [
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))'
  ].join('|');
  return new RegExp(pattern, 'g');
}

const ansiRegex = makeAnsiRegex();

function stripAnsi(text) {
  if(typeof text !== 'string') {
    throw new TypeError(`Expected a \`string\`, got \`${typeof text}\``);
  }

  return text.replace(ansiRegex, '');
}
//#endregion

//#region supportsColor
function getColorLevel(isTty) {
  if(!isTty) {
    return 0;
  }
  const term = process.env.TERM;
  if(term === 'dumb') {
    return 0;
  }

  if(process.env.COLORTERM === 'truecolor' || term === 'xterm-kitty') {
    return 3;
  }

  if('TERM_PROGRAM' in process.env) {
    const version = Number.parseInt((process.env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);
    switch(process.env.TERM_PROGRAM) {
      case 'iTerm.app': return version >= 3 ? 3 : 2;
      case 'Apple_Terminal': return 2;
    }
  }

  if(/-256(color)?$/i.test(term)) {
    return 2;
  }

  if(/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(term)) {
    return 1;
  }

  if('COLORTERM' in process.env) {
    return 1;
  }

  return 0;
}

function translateLevel(level) {
  if(level === 0) {
    return false;
  }

  return {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3
  };
}

const supportsColor = {
  stdout: translateLevel(getColorLevel(tty.isatty(1))),
  stderr: translateLevel(getColorLevel(tty.isatty(2)))
};
//#endregion

const _isNumOrStr = (v) => _isNum(v) || _isStr(v);

const useFormat = () => useFormat.force || !!supportsColor.stdout;

useFormat.force = false;

const style = (...sty) => {
  sty = _uniq(_flatten(sty.map((s) => (_isFunc(s) && s._s) ? s._s : s)).filter((s) => _isObj(s) && _isNumOrStr(s.o) && _isNumOrStr(s.c)));
  let o = _uniq(sty.map((s) => s.o)).join(';');
  let c = _uniq(sty.map((s) => s.c)).join(';');
  let func = function(str) { return useFormat() ? `\u001B[${o}m${str}\u001B[${c}m` : str; };
  func._s = sty;
  return func;
};

style.force = (force = true) => { useFormat.force = force; };
style.forced = () => useFormat.force;
style.enabled = () => useFormat();
style.clean = (str) => str && stripAnsi(str);
style.len = (str) => str ? _stringSize(style.clean(str)) : 0;
style.pad = (string, length = 0, chars = ' ') => {
  const strLength = length ? style.len(string) : 0;
  if(!length || length <= strLength) {
    return string || '';
  }
  const startLength = Math.floor((length - strLength) / 2);
  const endLength = length - strLength - startLength;
  return `${_createPadding(startLength, chars)}${string}${_createPadding(endLength, chars)}`;
};
style.padStart = (string, length = 0, chars = ' ') => {
  const strLength = length ? style.len(string) : 0;
  if(!length || length <= strLength) {
    return string || '';
  }
  const startLength = length - strLength;
  return `${_createPadding(startLength, chars)}${string}`;
};
style.padEnd = (string, length = 0, chars = ' ') => {
  const strLength = length ? style.len(string) : 0;
  if(!length || length <= strLength) {
    return string || '';
  }
  const endLength = length - strLength;
  return `${string}${_createPadding(endLength, chars)}`;
};

const brightBg = (normal, bright, bg) => {
  let sty = style(normal);
  sty.bright = style(bright);
  sty.bg = style(bg);
  return sty;
};

const p = (o, c) => ({ o, c });
const styles = {
  bold: style(p(1, 22)),
  dim: style(p(2, 22)),
  italic: style(p(3, 23)),
  underline: style(p(4, 24)),
  black: brightBg(p(30, 39), p(90, 39), p(40, 49)),
  red: brightBg(p(31, 39), p(91, 39), p(41, 49)),
  green: brightBg(p(32, 39), p(92, 39), p(42, 49)),
  yellow: brightBg(p(33, 39), p(93, 39), p(43, 49)),
  blue: brightBg(p(34, 39), p(94, 39), p(44, 49)),
  magenta: brightBg(p(35, 39), p(95, 39), p(45, 49)),
  cyan: brightBg(p(36, 39), p(96, 39), p(46, 49)),
  white: brightBg(p(37, 39), p(97, 39), p(47, 49)),
  customColor(num) {
    let sty = style(p(`38;5;${num}`, 39));
    sty.bg = style(p(`48;5;${num}`, 49));
    return sty;
  }
};


const borderChars = {
  thin: {
    topLeft: '\u250c',
    topRight: '\u2510',
    bottomLeft: '\u2514',
    bottomRight: '\u2518',
    horizontal: '\u2500',
    vertical: '\u2502'
  },
  thick: {
    topLeft: '\u250f',
    topRight: '\u2513',
    bottomLeft: '\u2517',
    bottomRight: '\u251b',
    horizontal: '\u2501',
    vertical: '\u2503'
  }
};

const getBorderStylize = (bold, dim) => {
  if(bold && dim) {
    return style(styles.bold, styles.dim);
  } else if(bold) {
    return styles.bold;
  } else if(dim) {
    return styles.dim;
  } else {
    return (str) => str;
  }
};

const applyBorder = (str, bold, dim, thick) => {
  let len = Math.max(..._flatten([str]).map(style.len));
  let stylize = getBorderStylize(bold, dim);
  const chars = thick ? borderChars.thick : borderChars.thin;
  const topBorder = stylize(`${chars.topLeft}${_repeat(chars.horizontal, len + 2)}${chars.topRight}`);
  const bottomBorder = stylize(`${chars.bottomLeft}${_repeat(chars.horizontal, len + 2)}${chars.bottomRight}`);
  const side = stylize(chars.vertical);
  const middle = _flatten([str]).map((l) => `${side} ${style.padEnd(l, len)} ${side}`).join('\n');
  return `${topBorder}\n${middle}\n${bottomBorder}`;
};

const borderMaker = (bold = false, dim = false, thick = false) => {
  const func = (str) => applyBorder(str, bold, dim, thick);
  const pt = {};
  Object.defineProperties(pt, {
    bold: {
      get: () => borderMaker(true, dim, thick)
    },
    dim: {
      get: () => borderMaker(bold, true, thick)
    },
    thick: {
      get: () => borderMaker(bold, dim, true)
    },
    unbold: {
      get: () => borderMaker(false, dim, thick)
    },
    undim: {
      get: () => borderMaker(bold, false, thick)
    },
    thin: {
      get: () => borderMaker(bold, dim, false)
    }
  });
  func.__proto__ = pt;
  return func;
};

const border = borderMaker();

module.exports = {
  stripAnsi,
  supportsColor,
  style,
  styles,
  borderMaker,
  border
};
