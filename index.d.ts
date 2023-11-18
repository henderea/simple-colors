export declare interface BorderMaker {
    (str: string): string;

    readonly bold: BorderMaker;
    readonly dim: BorderMaker;
    readonly thick: BorderMaker;
    readonly unbold: BorderMaker;
    readonly undim: BorderMaker;
    readonly thin: BorderMaker;
}

export declare function borderMaker(bold?: boolean, dim?: boolean, thick?: boolean): BorderMaker;
export declare const border: BorderMaker;

export declare type StyleFunction = (str: string) => string;
export declare interface ColorStyleFunction {
    (str: string): string;
    bright(str: string): string;
    bg(str: string): string;
}
export declare interface CustomColorStyleFunction {
    (str: string): string;
    bg(str: string): string;
}

export declare type StyleDef = {
    o: number | string,
    c: number | string
};
export declare interface Style {
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

export declare const style: Style;

export declare interface Styles {
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
    customColor(num: number): CustomColorStyleFunction;
}

export declare const styles: Styles;

export declare function stripAnsi(text: string): string;

export declare type ColorSupport = false | {
  level: 1,
  hasBasic: true,
  has256: false,
  has16m: false
} | {
  level: 2,
  hasBasic: true,
  has256: true,
  has16m: false
} | {
  level: 3,
  hasBasic: true,
  has256: true,
  has16m: true
};

export declare interface SupportsColor {
  stdout: ColorSupport;
  stderr: ColorSupport;
}

export declare const supportsColor: SupportsColor;
