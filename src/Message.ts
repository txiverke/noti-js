import { NotijsOptions } from './index';
import * as Helper from './helpers';
import SETTINGS from './settings';
import successSVG from './svgs/success.svg';
import errorSVG from './svgs/error.svg';
import notificationSVG from './svgs/notification.svg';

export class Message {
  private observer: MutationObserver;
  public $container!: HTMLElement;
  public $message!: HTMLElement;
  public $icon!: HTMLElement;

  constructor(public text: string, public options: NotijsOptions) {
    this.text = text;
    this.options = {
      duration: options?.duration
        ? options.duration * 1000
        : SETTINGS.options.duration,
      icon: options?.icon,
      position: options?.position || SETTINGS.options.position,
      extend: options?.extend || {},
    };

    this.animate = this.animate.bind(this);

    this.observer = new MutationObserver((mutationsList) =>
      // @ts-ignore
      this.mutationObserverCB(mutationsList, this.animate),
    );
  }

  public init() {
    this.$container =
      document.getElementById(SETTINGS.id) ||
      Helper.setDOM('ol', { ...Helper.setPosition(this.options.position) });

    this.$message = Helper.setDOM(
      'li',
      {
        ...SETTINGS.styles.message,
        ...this.options.extend,
      },
      {
        'role': 'alert',
        'aria-live': 'polite',
        'aria-atomic': 'true',
      },
    );

    this.observer.observe(document, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    if (!document.getElementById(SETTINGS.id)) {
      this.css();
      this.$container.id = SETTINGS.id;
      this.$container.classList.add('notijs_container');
      document.body.append(this.$container);
    }

    if (this.options.icon) {
      this.$icon = this.icon();
      this.$message.append(this.$icon);
    }

    const messageTxt = Helper.setDOM('span', { ...SETTINGS.styles.txt });
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

  private mutationObserverCB(
    mutationsList: (MutationRecord & { target: { id: string } })[],
    cb: (str: 'in') => void,
  ) {
    for (const mutation of mutationsList) {
      if (
        mutation.type === 'childList' &&
        mutation.target?.id === SETTINGS.id
      ) {
        cb('in');
      }
    }
  }

  private icon() {
    let src: typeof errorSVG | typeof notificationSVG | typeof successSVG;

    switch (this.options.icon) {
      case 'error':
        src = errorSVG;
        break;
      case 'notification':
        src = notificationSVG;
        break;
      case 'success':
        src = successSVG;
        break;
      default:
        throw new Error('Invalid Icon');
    }

    return Helper.setDOM(
      'img',
      { ...SETTINGS.styles.icon, margin: '0 8px 0 0' },
      { src },
    );
  }

  private css() {
    const animationCSS = Helper.setDOM('style');
    animationCSS.id = 'notijs_styles';
    animationCSS.textContent = `.notijs_container{position:fixed;width: 250px;height: auto;flex-direction: column;list-style:none;padding: 5px 0;margin: 0;display: flex;align-items: center;}.notijs_rotate{animation: notijs_rotation .75s linear infinite;}@keyframes notijs_rotation {from{transform: rotate(0deg);}to{transform: rotate(359deg);}`;

    document.head.append(animationCSS);
  }
}
