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

const brightBg = (normal, bright, bg) => {
    let sty = style(normal);
    sty.bright = style(bright);
    sty.bg = style(bg);
    return sty;
}

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
    white: brightBg(p(37, 39), p(97, 39), p(47, 49))
};

module.exports = {
    style,
    styles
};