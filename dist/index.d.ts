interface Dict<T> {
    [k: string]: T;
}

interface INotifierOptions {
    duration: number;
    position: string;
    extend: Dict<{}>;
}
declare function auto(msg: string, options?: INotifierOptions): void;
declare function close(msg: string, options?: INotifierOptions): void;
declare const notijs: {
    auto: typeof auto;
    close: typeof close;
};

export { INotifierOptions, notijs };
