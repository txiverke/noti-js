import { Message } from './Message';
import { INotifierOptions } from './index';
import DEFAULTS from './defaults.json';
import * as Helper from './helpers';
import closeSvg from './svgs/close.svg';

export class Static extends Message {
  $icon: HTMLElement;

  protected clickEventListener: EventListener;

  constructor(text: string, options: Partial<INotifierOptions>) {
    super(text, options);
    this.$icon = Helper.setDOM(document.createElement('button'), {
      ...DEFAULTS.styles.icon,
    });

    this.clickEventListener = () => this.destroy();
  }

  render() {
    this.init();

    this.$icon.appendChild(
      Helper.setDOM(
        document.createElement('img'),
        { cursor: 'pointer' },
        {
          src: closeSvg,
          width: DEFAULTS.styles.icon.width,
          height: DEFAULTS.styles.icon.height,
        },
      ),
    );
    this.$message.appendChild(this.$icon);
    this.$icon.addEventListener('click', this.clickEventListener);
  }

  destroy() {
    super.destroy();

    this.$icon.removeEventListener('click', this.clickEventListener);
  }
}
