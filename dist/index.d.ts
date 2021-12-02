interface Dict<T> {
    [k: string]: T;
}

declare type Icon = 'error' | 'notification' | 'success' | {
    src: string;
    alt?: string;
};
declare type Mode = 'auto' | 'close';
interface NotijsOptions {
    mode?: Mode;
    icon: Icon;
    duration: number;
    position: string;
    extend?: {
        message: Dict<string | number>;
        progressbar: Dict<string | number>;
    };
}
interface NotijsPromise {
    fn: () => Promise<any>;
    success: string;
    error: string;
}
declare function render(msg: string, options?: NotijsOptions): void;
declare function promise(msg: string, options: NotijsOptions | undefined, promise: NotijsPromise): Promise<any>;
declare const notijs: {
    render: typeof render;
    promise: typeof promise;
};

export { NotijsOptions, NotijsPromise, notijs };
