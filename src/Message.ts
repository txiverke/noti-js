import { INotifierOptions } from './index';
import * as Helper from './helpers';
import * as DEFAULTS from './defaults.json';

export class Message {
  text: string;
  options: INotifierOptions;
  observer: MutationObserver;
  $container: HTMLElement;
  $message: HTMLElement;

  constructor(text: string, options: Partial<INotifierOptions>) {
    this.text = text;
    this.options = {
      duration: options?.duration
        ? options.duration * 1000
        : DEFAULTS.options.duration,
      position: options?.position || DEFAULTS.options.position,
      extend: options?.extend || {},
    };

    this.$container =
      document.getElementById(DEFAULTS.id) ||
      Helper.setDOM(document.createElement('ol'), {
        ...DEFAULTS.styles.container,
        ...Helper.setPosition(this.options.position),
      });

    this.$message = Helper.setDOM(document.createElement('li'), {
      ...DEFAULTS.styles.message,
      ...this.options.extend,
    });

    this.observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === 'childList' &&
          // @ts-ignore
          mutation.target?.id === DEFAULTS.id
        ) {
          this.animate('in');
        }
      }
    });
  }

  init() {
    this.observer.observe(document, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    if (!document.getElementById(DEFAULTS.id)) {
      this.$container.id = DEFAULTS.id;
      document.body.append(this.$container);
    }

    this.$message.textContent = this.text;
    this.$container.append(this.$message);
  }

  animate(effect: 'in' | 'out') {
    this.$message.dataset.animation = effect;
    const [x, y] = Helper.setTranslate(effect, this.options.position);

    setTimeout(() => {
      this.$message.style.transform = `translate(${x}px, ${y}px)`;
      this.$message.style.opacity = effect === 'in' ? '1' : '0';
    });

    this.observer.disconnect();
  }

  destroy() {
    this.$message.remove();
  }
}
