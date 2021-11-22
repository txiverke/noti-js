import { Auto } from './Auto';
import { Static } from './Static';
import { Dict } from './types'

export interface INotifierOptions {
  duration: number;
  position: string;
  extend: Dict<{}>;
}

function auto(msg: string, options: INotifierOptions = {} as INotifierOptions) {
  const newAuto = new Auto(msg, options);
  newAuto.render();
}

function close(
  msg: string,
  options: INotifierOptions = {} as INotifierOptions,
) {
  const newStatic = new Static(msg, options);
  newStatic.render();
}

export const notijs = {
  auto,
  close,
};
