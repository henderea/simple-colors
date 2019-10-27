const _flatten = require('lodash/flatten');
const _max = require('lodash/max');
const { style, styles } = require('.');
const { bold, underline, green, cyan } = styles;

const _peek = (array) => array[array.length - 1];
const _pushAll = (array, ...args) => {
    _flatten(args).forEach(arg => {
        array.push(arg);
    });
    return array;
};

class HelpTextMaker {
    constructor(name) {
        this._name = name;
        this._mode = null;
        this._text = []
        this._dictText = [];
        this._wrap = false;
        this._wrapIndent = [0];
    }

    pushWrap(wrapIndent = 0) {
        this._wrapIndent.push(wrapIndent);
        return this;
    }

    popWrap() {
        if(this._wrapIndent.length > 1) {
            this._wrapIndent.pop();
        }
        return this;
    }

    wrap(wrap = true) {
        this._wrap = wrap;
        return this;
    }

    text(...text) {
        text = _flatten(text);
        if(this._mode) {
            if(this._mode == 'wrap') {
                this._wrapper.push(text);
            } else {
                let peek = _peek(this._dictText);
                if(peek && peek.mode == this._mode) {
                    _pushAll(peek.text, text);
                } else {
                    this._dictText.push({ mode: this._mode, text: text });
                }
            }
        } else {
            let wrapIndent = _peek(this._wrapIndent);
            let peek = _peek(this._text);
            if(peek && peek.wrapIndent == wrapIndent) {
                _pushAll(peek.text, text);
            } else {
                this._text.push({ wrapIndent, text: text });
            }
        }
        return this;
    }

    bold(text) {
        this.text(bold(text));
        return this;
    }

    get title() {
        return this.bold(this._name);
    }

    get name() {
        return this.text(this._name);
    }

    get nl() {
        return this.text('\n');
    }

    get tab() {
        return this.text('    ');
    }

    get space() {
        return this.text(' ');
    }

    get usage() {
        return this.bold('Usage:');
    }

    param(param) {
        return this.text(style(cyan.bright, underline)(param));
    }

    get flags() {
        return this.bold('Flags:');
    }

    get params() {
        return this.bold('Parameters:');
    }

    get dict() {
        this._mode = 'dict';
        return this;
    }

    get key() {
        this._mode = 'key';
        return this;
    }

    get value() {
        this._mode = 'value';
        return this;
    }

    get end() {
        this._mode = 'dict';
        return this;
    }

    get endDict() {
        this._mode = null;
        let maxKeyLength = _max(this._dictText.filter(d => d.mode == 'key').map(d => style.len(d.text.join(''))));
        let valueWrapIndent = maxKeyLength + 4;
        this._dictText.forEach(d => {
            if(d.mode === 'value') {
                this.pushWrap(valueWrapIndent).tab.text(d.text).popWrap();
            } else if(d.mode === 'key') {
                this.text(d.text);
                let len = style.len(d.text.join(''));
                if(len < maxKeyLength) {
                    this.text(' '.repeat(maxKeyLength - len));
                }
            } else {
                this.text(d.text);
            }
        });
        this._dictText = [];
        return this;
    }

    flag(...flags) {
        return this.text(flags.map(flag => green.bright(flag)).join(', '));
    }

    toString(wrap = -1) {
        if(this._wrap) {
            if(process.stdout.isTTY && wrap <= 0 || wrap > process.stdout.columns) {
                wrap = process.stdout.columns;
            }
        } else {
            wrap = -1;
        }
        let lastLineLength = 0;
        return this._text.map(t => {
            let lines = t.text.join('').split(/\n/);
            if(wrap > 0) {
                lines = lines.map(l => {
                    let words = l.split(/ /);
                    let wrappedLines = [[]];
                    words.forEach(w => {
                        let line = _peek(wrappedLines);
                        let lineLength = style.len(line.join(' '));
                        if(wrappedLines.length == 1) {
                            lineLength += lastLineLength;
                        }
                        let wordLength = style.len(w);
                        if(lineLength + wordLength + 1 > wrap) {
                            line = [];
                            for(let i = 0; i < t.wrapIndent; i++) {
                                line.push('');
                            }
                            wrappedLines.push(line);
                        }
                        line.push(w);
                    });
                    lastLineLength = style.len(wrappedLines.map(l => l.join(' ')));
                    return wrappedLines.map(l => l.join(' ')).join('\n');
                }).join('\n').split(/\n/);
            }
            lastLineLength = style.len(_peek(lines));
            return lines.join('\n');
        }).join('');
    }
}

module.exports = {
    HelpTextMaker,
    style,
    styles
};