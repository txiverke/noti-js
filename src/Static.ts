import { Message } from './Message';
import { NotijsOptions } from './index';
import closeSVG from './svgs/close.svg';

export class Static extends Message {
  public $button: HTMLElement;
  protected clickEventListener: EventListener;

  constructor(text: string, options: NotijsOptions) {
    super(text, options);
    this.$button = document.createElement('button');
    this.clickEventListener = () => this.destroy();
  }

  public render() {
    this.init();

    const img = document.createElement('img');
    img.src = closeSVG;
    img.alt = 'Close Message';

    this.$button.classList.add('notijs_btn');
    this.$button.appendChild(img);
    this.$message.appendChild(this.$button);
    this.$button.addEventListener('click', this.clickEventListener);
  }

  protected destroy() {
    super.destroy();
    this.$button.removeEventListener('click', this.clickEventListener);
  }
}
