import { INotifierOptions } from './index';
import * as Helper from './helpers';
import SETTINGS from './settings';

export class Message implements Message {
  private observer: MutationObserver;
  public $container!: HTMLElement;
  public $message!: HTMLElement;

  constructor(public text: string, public options: INotifierOptions) {
    this.text = text;
    this.options = {
      duration: options?.duration
        ? options.duration * 1000
        : SETTINGS.options.duration,
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
      Helper.setDOM(document.createElement('ol'), {
        ...SETTINGS.styles.container,
        ...Helper.setPosition(this.options.position),
      });

    this.$message = Helper.setDOM(document.createElement('li'), {
      ...SETTINGS.styles.message,
      ...this.options.extend,
    });

    this.observer.observe(document, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    if (!document.getElementById(SETTINGS.id)) {
      this.$container.id = SETTINGS.id;
      document.body.append(this.$container);
    }

    const messageTxt = Helper.setDOM(document.createElement('span'), {
      flex: 1,
    });

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
}
