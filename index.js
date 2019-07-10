const _uniq = require('lodash/uniq');
const _flatten = require('lodash/flatten');
const _isFunc = require('lodash/isFunction');
const _isObj = require('lodash/isPlainObject');
const _isNum = require('lodash/isNumber');
const _isStr = require('lodash/isString');

const _isNumOrStr = v => _isNum(v) || _isStr(v);

const style = (...sty) => {
    sty = _uniq(_flatten(sty.map(s => (_isFunc(s) && s._s) ? s._s : s)).filter(s => _isObj(s) && _isNumOrStr(s.o) && _isNumOrStr(s.c)));
    let o = _uniq(sty.map(s => s.o)).join(';');
    let c = _uniq(sty.map(s => s.c)).join(';');
    let func = function(str) { return `\u001B[${o}m${str}\u001B[${c}m`; }
    func._s = sty;
    return func;
}

const bright = (normal, bright) => {
    let sty = style(normal);
    sty.bright = style(bright);
    return sty;
}

const p = (o, c) => ({ o, c });
const styles = {
    bold: style(p(1, 22)),
    dim: style(p(2, 22)),
    italic: style(p(3, 23)),
    underline: style(p(4, 24)),
    black: bright(p(30, 39), p(90, 39)),
    red: bright(p(31, 39), p(91, 39)),
    green: bright(p(32, 39), p(92, 39)),
    yellow: bright(p(33, 39), p(93, 39)),
    blue: bright(p(34, 39), p(94, 39)),
    magenta: bright(p(35, 39), p(95, 39)),
    cyan: bright(p(36, 39), p(96, 39)),
    white: bright(p(37, 39), p(97, 39))
};

module.exports = {
    style,
    styles
};