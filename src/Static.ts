import { Message } from './Message';
import { INotifierOptions } from './index';
import SETTINGS from './settings';
import * as Helper from './helpers';

export class Static extends Message {
  public $close: HTMLElement;
  protected clickEventListener: EventListener;

  constructor(text: string, options: INotifierOptions) {
    super(text, options);
    this.$close = Helper.setDOM(document.createElement('button'), {
      ...SETTINGS.styles.button,
    });

    this.clickEventListener = () => this.destroy();
  }

  public render() {
    this.init();
    this.$close.textContent = 'Close'
    this.$message.appendChild(this.$close);
    this.$close.addEventListener('click', this.clickEventListener);
  }

  protected destroy() {
    super.destroy();
    this.$close.removeEventListener('click', this.clickEventListener);
  }
}
