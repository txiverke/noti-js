import { Dict, Extend, Icon, NotijsOptions, Position } from './index';
import { OPTIONS, STYLES, ANIMATION_SIZE } from './settings';
import successSVG from './svgs/success.svg';
import errorSVG from './svgs/error.svg';
import notificationSVG from './svgs/notification.svg';

export class Message {
  protected duration: number;
  protected position: Position;
  protected icon: Icon;
  protected extend: Extend | undefined;
  protected $container: HTMLElement;
  protected $message!: HTMLElement;
  protected $icon!: HTMLImageElement;
  private observer: MutationObserver;

  constructor(public text: string, public options: NotijsOptions) {
    this.text = text;
    this.duration = (options?.duration || OPTIONS.duration) * 1000;
    this.position = options?.position || OPTIONS.position;
    this.icon = options?.icon;
    this.extend = options?.extend;
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
    this.observer.observe(document, { childList: true, subtree: true });

    if (!document.getElementById(OPTIONS.id)) {
      this.setCSS('body', STYLES.body);

      this.$container.id = OPTIONS.id;
      this.$container.classList.add('notijs_container');

      document.body.append(this.$container);
    }

    this.$message = this.setExtend(document.createElement('li'), this.extend?.message || {});
    this.$message.classList.add('notijs_message');
    this.$message.setAttribute('role', 'alert');
    this.$message.setAttribute('aria-live', 'polite');

    if (this.position !== this.$container.dataset.position) {
      this.$container = this.setPosition(this.$container, this.position);
    }

    if (this.icon) this.$message.append(this.setIcon());

    const messageTxt = document.createElement('span');
    messageTxt.classList.add('notijs_txt');
    messageTxt.textContent = this.text;

    this.$message.append(messageTxt);
    this.$container.append(this.$message);
  }

  protected animate(effect: 'in' | 'out') {
    this.$message.dataset.animation = effect;
    let coords = [0, 0];

    switch (this.position) {
      case 'top':
        coords = effect === 'in' ? [0, ANIMATION_SIZE] : [0, -ANIMATION_SIZE];
        break;
      case 'bottom':
        coords = effect === 'in' ? [0, -ANIMATION_SIZE] : [0, ANIMATION_SIZE];
        break;
      case 'top_right':
      case 'bottom_right':
        coords = effect === 'in' ? [-ANIMATION_SIZE, 0] : [ANIMATION_SIZE, 0];
        break;
      case 'top_left':
      case 'bottom_left':
        coords = effect === 'in' ? [ANIMATION_SIZE, 0] : [-ANIMATION_SIZE, 0];
        break;
    }

    setTimeout(() => {
      this.$message.style.transform = `translate(${coords[0]}px, ${coords[1]}px)`;
      this.$message.style.opacity = effect === 'in' ? '1' : '0';
    });

    this.observer.disconnect();
  }

  private setIcon() {
    const { src, alt } =
      typeof this.icon === 'object'
        ? this.icon
        : {
            src:
              this.icon === 'error'
                ? errorSVG
                : this.icon === 'success'
                ? successSVG
                : notificationSVG,
            alt: this.icon,
          };

    this.$icon = document.createElement('img');
    this.$icon.src = src;
    this.$icon.alt = alt || 'Icon';
    this.$icon.classList.add('notijs_icon');

    return this.$icon;
  }

  public setCSS(prop: string, style: string) {
    const id = `notijs_${prop}`;

    if (!document.getElementById(id)) {
      const styles = document.createElement('style');
      styles.id = id;
      styles.textContent = style;

      document.head.append(styles);
    }
  }

  public setExtend(el: HTMLElement, styles: Dict<string | number>) {
    for (let key in styles) {
      // @ts-ignoref
      el.style[key] = styles[key];
    }

    return el;
  }

  private setPosition(el: HTMLElement, position: Position) {
    const pos = {} as Dict<string | number>;
    const parts = position.split('_');

    for (let key of parts) {
      pos[key] = 0;
    }

    return this.setExtend(el, parts.length === 1 ? { ...pos, width: '100%' } : pos);
  }

  protected destroy() {
    this.$message.remove();
  }
}
