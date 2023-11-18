export { StyleFunction, ColorStyleFunction, CustomColorStyleFunction, StyleDef, Style, style, Styles, styles, stripAnsi } from './index';

export declare class HelpTextMaker {
  constructor(name: string);

  pushWrap(wrapIndent?: number): this;
  popWrap(): this;
  wrap(wrap?: boolean): this;
  text(...text: Array<string | string[]>): this;
  bold(text: string): this;
  get title(): this;
  get name(): this;
  get nl(): this;
  get tab(): this;
  get space(): this;
  get usage(): this;
  param(param: string): this;
  get flags(): this;
  get params(): this;
  get dict(): this;
  get key(): this;
  get value(): this;
  get end(): this;
  get endDict(): this;
  get ul(): this;
  get ol(): this;
  get endList(): this;
  get endUl(): this;
  get endOl(): this;
  get li(): this;
  flag(...flags: string[]): this;
  toString(wrap?: number): string;
}
