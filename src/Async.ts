import { Message } from './Message';
import { INotifierOptions, IPromise } from './index';
import DEFAULTS from './defaults.json';

export class Async extends Message {
  protected asyncFn: IPromise;

  constructor(text: string, options: Partial<INotifierOptions>, promise: IPromise) {
    super(text, {
      duration: DEFAULTS.options.duration,
      position: DEFAULTS.options.position,
      ...options,
    });

    this.asyncFn = promise || {};
  }
  render() {
    const newPromise = this.asyncFn.fn();
    newPromise.then().catch();
  }
}
