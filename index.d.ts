declare interface BorderMaker {
    (str: string): string;

    readonly bold: BorderMaker;
    readonly dim: BorderMaker;
    readonly thick: BorderMaker;
    readonly unbold: BorderMaker;
    readonly undim: BorderMaker;
    readonly thin: BorderMaker;
}

declare function borderMaker(bold?: boolean, dim?: boolean, thick?: boolean): BorderMaker;
declare const border: BorderMaker;

declare type StyleFunction = (str: string) => string;
declare interface ColorStyleFunction {
    (str: string): string;
    bright(str: string): string;
    bg(str: string): string;
}

declare type StyleDef = {
    o: number,
    c: number
}
declare interface Style {
    (...sty: Array<StyleFunction | StyleDef>): StyleFunction;

    force(force?: boolean): void;
    forced(): boolean;
    enabled(): boolean;
    clean(str: string | null | undefined): string | null | undefined;
    len(str: string | null | undefined): number;
    pad(str: string | null | undefined, length?: number, chars?: string): string;
    padStart(str: string | null | undefined, length?: number, chars?: string): string;
    padEnd(str: string | null | undefined, length?: number, chars?: string): string;
}

declare const style: Style;

declare interface Styles {
    bold: StyleFunction;
    dim: StyleFunction;
    italic: StyleFunction;
    underline: StyleFunction;
    black: ColorStyleFunction;
    red: ColorStyleFunction;
    green: ColorStyleFunction;
    yellow: ColorStyleFunction;
    blue: ColorStyleFunction;
    magenta: ColorStyleFunction;
    cyan: ColorStyleFunction;
    white: ColorStyleFunction;
}

declare const styles: Styles

export = {
    borderMaker,
    border,
    style,
    styles
}