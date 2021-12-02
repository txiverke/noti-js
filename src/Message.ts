import { NotijsOptions } from './index';
import * as Helper from './helpers';
import { ARIA, OPTIONS, STYLES } from './settings';

import successSVG from './svgs/success.svg';
import errorSVG from './svgs/error.svg';
import notificationSVG from './svgs/notification.svg';

export class Message {
  private observer: MutationObserver;
  public $container: HTMLElement;
  public $message!: HTMLElement;
  public $icon!: HTMLElement;

  constructor(public text: string, public options: NotijsOptions) {
    this.text = text;
    this.options = {
      duration: (options?.duration || OPTIONS.duration) * 1000,
      position: options?.position || OPTIONS.position,
      icon: options?.icon,
      extend: options?.extend,
    };

    this.$container = document.getElementById(OPTIONS.id) || document.createElement('ol');
    this.animate = this.animate.bind(this);

    this.observer = new MutationObserver((mutationsList: (MutationRecord & { target: any })[]) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.target.id === OPTIONS.id) {
          this.animate('in');
        }
      }
    });
  }

  public init() {
    if (!document.getElementById(OPTIONS.id)) {
      this.css();

      this.$container.id = OPTIONS.id;
      this.$container.classList.add('notijs_container');
      this.$container.dataset.position = this.options.position;
      this.$container = Helper.setDOM(this.$container, {
        ...Helper.setPosition(this.options.position),
      });

      document.body.append(this.$container);
    }

    this.$message = document.createElement('li');
    this.$message.classList.add('notijs_message');
    this.$message = Helper.setDOM(this.$message, this.options?.extend?.message, ARIA);

    this.observer.observe(document, { childList: true, subtree: true });

    if (this.options.position !== this.$container.dataset.position) {
      Helper.setDOM(this.$container, { ...Helper.setPosition(this.options.position) });
    }

    if (this.options.icon) {
      this.$icon = this.icon();
      this.$message.append(this.$icon);
    }

    const messageTxt = document.createElement('span');
    messageTxt.classList.add('notijs_txt');
    messageTxt.textContent = this.text;

    this.$message.append(messageTxt);
    this.$container.append(this.$message);
  }

  protected animate(effect: 'in' | 'out') {
    this.$message.dataset.animation = effect;
    const [x, y] = Helper.setTranslate(effect, this.options.position);

    setTimeout(() => {
      this.$message.style.transform = `translate(${x}px, ${y}px)`;
      this.$message.style.opacity = effect === 'in' ? '1' : '0';
    });

    this.observer.disconnect();
  }

  protected destroy() {
    this.$message.remove();
  }

  private icon() {
    let img = Helper.setDOM(document.createElement('img'), {
      margin: '0 8px 0 0',
      width: '18px',
      height: 'auto',
    });

    if (typeof this.options.icon === 'object') {
      img = Helper.setDOM(img, null, {
        src: this.options.icon.src,
        alt: this.options.icon.alt || 'Icon',
      });
    } else {
      img = Helper.setDOM(img, null, {
        src:
          this.options.icon === 'error'
            ? errorSVG
            : this.options.icon === 'success'
            ? successSVG
            : notificationSVG,
        alt: this.options.icon,
      });
    }

    return img;
  }

  private css() {
    const styles = document.createElement('style');
    styles.id = 'notijs_styles';
    styles.textContent = STYLES;

    document.head.append(styles);
  }
}
