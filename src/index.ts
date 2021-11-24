import { Auto } from './Auto';
import { Static } from './Static';
import { Async } from './Async';
import { Dict } from './types';

type Icon = 'error' | 'notification' | 'success';
type Mode = 'auto' | 'close';

export interface NotijsOptions {
  mode?: Mode;
  icon: Icon;
  duration: number;
  position: string;
  extend: Dict<{}>;
}

function render(msg: string, options = {} as NotijsOptions) {
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

async function promise(
  msg: string,
  options = {} as NotijsOptions,
  promise: () => Promise<any>,
) {
  const newNotijs = new Async(msg, options, promise);
  return await newNotijs.render();
}

export const notijs = {
  render,
  promise,
};
