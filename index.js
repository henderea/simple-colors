const _uniq = require('lodash/uniq');
const _map = require('lodash/map');
const _filter = require('lodash/filter');
const _flatten = require('lodash/flatten');
const _isFunction = require('lodash/isFunction');
const _isPlainObject = require('lodash/isPlainObject');
const _isNumber = require('lodash/isNumber');
const _isString = require('lodash/isString');

const _isNumberOrString = v => _isNumber(v) || _isString(v);

const style = (...sty) => {
    sty = _map(sty, s => (_isFunction(s) && s.sty) ? s.sty : s);
    sty = _flatten(sty);
    sty = _filter(sty, s => _isPlainObject(s) && _isNumberOrString(s.open) && _isNumberOrString(s.close));
    sty = _uniq(sty);
    let func = function(str) { return `\u001B[${_map(sty, 'open').join(';')}m${str}\u001B[${_map(sty, 'close').join(';')}m`; }
    func.sty = sty;
    return func;
}

const bright = (normal, bright) => {
    let sty = style(normal);
    sty.bright = style(bright);
    return sty;
}

const p = (open, close) => ({open, close});
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