import { Message } from './Message';
import { NotijsOptions } from './index';
import SETTINGS from './settings';
import * as Helper from './helpers';
import closeSVG from './svgs/close.svg';

export class Static extends Message {
  public $button: HTMLElement;
  protected clickEventListener: EventListener;

  constructor(text: string, options: NotijsOptions) {
    super(text, options);
    this.$button = Helper.setDOM('button', { ...SETTINGS.styles.button });

    this.clickEventListener = () => this.destroy();
  }

  public render() {
    this.init();

    const img = Helper.setDOM(
      'img',
      { ...SETTINGS.styles.icon },
      { src: closeSVG },
    );

    this.$button.appendChild(img);
    this.$message.appendChild(this.$button);
    this.$button.addEventListener('click', this.clickEventListener);
  }

  protected destroy() {
    super.destroy();
    this.$button.removeEventListener('click', this.clickEventListener);
  }
}
