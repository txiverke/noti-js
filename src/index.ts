import { Auto } from './Auto';
import { Async } from './Async';
import { Static } from './Static';

export interface IPromise {
  fn: Function;
  success: Function;
  error: Function;
}

export interface INotifierOptions {
  duration: number;
  position: string;
  extend?: { [x: string]: string };
}

export const notifier = {
  auto: (msg: string, options: Partial<INotifierOptions> = {}) => {
    const newAuto = new Auto(msg, options);
    newAuto.render();
  },
  static: (msg: string, options: Partial<INotifierOptions> = {}) => {
    const newStatic = new Static(msg, options);
    newStatic.render();
  },
  promise: (
    msg: string,
    options: Partial<INotifierOptions> = {},
    promise: IPromise,
  ) => {
    const newPromise = new Async(msg, options, promise);
    return newPromise.render();
  },
};
