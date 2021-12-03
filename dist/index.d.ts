declare type Mode = 'auto' | 'close';
declare type Extend = {
    message: Dict<string | number>;
    progressbar: Dict<string | number>;
};
interface Dict<T> {
    [k: string]: T;
}
declare type Icon = 'error' | 'notification' | 'success' | {
    src: string;
    alt?: string;
};
declare type Position = 'top' | 'top_left' | 'top_right' | 'bottom' | 'bottom_left' | 'bottom_right';
interface NotijsOptions {
    mode?: Mode;
    icon: Icon;
    duration: number;
    position: Position;
    extend?: Extend;
}
interface NotijsPromise {
    fn: () => Promise<any>;
    success: string;
    error: string;
}
declare function message(msg: string, options?: NotijsOptions): void;
declare function promise(msg: string, options: NotijsOptions | undefined, promise: NotijsPromise): Promise<any>;
declare const notijs: {
    message: typeof message;
    promise: typeof promise;
};

export { Dict, Extend, Icon, NotijsOptions, NotijsPromise, Position, notijs };
