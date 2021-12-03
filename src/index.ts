import { Auto } from './Auto';
import { Static } from './Static';
import { Async } from './Async';

type Mode = 'auto' | 'close';

export type Extend = {
  message: Dict<string | number>;
  progressbar: Dict<string | number>;
};

export interface Dict<T> {
  [k: string]: T;
}
export type Icon = 'error' | 'notification' | 'success' | { src: string; alt?: string };

export type Position = 'top' | 'top_left' | 'top_right' | 'bottom' | 'bottom_left' | 'bottom_right';

export interface NotijsOptions {
  mode?: Mode;
  icon: Icon;
  duration: number;
  position: Position;
  extend?: Extend;
}

export interface NotijsPromise {
  fn: () => Promise<any>;
  success: string;
  error: string;
}

function message(msg: string, options = {} as NotijsOptions) {
  let newNotijs: Auto | Static;
  const { mode, ...rest } = options;

  switch (mode) {
    case 'auto':
      newNotijs = new Auto(msg, rest);
      break;
    case 'close':
      newNotijs = new Static(msg, rest);
      break;
    default:
      newNotijs = new Auto(msg, rest);
  }

  newNotijs.render();
}

async function promise(msg: string, options = {} as NotijsOptions, promise: NotijsPromise) {
  const newNotijs = new Async(msg, options, promise);
  return await newNotijs.render();
}

export const notijs = {
  message,
  promise,
};
