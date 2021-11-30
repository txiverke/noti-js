import { Message } from './Message';
import { NotijsOptions } from './index';
import * as Helper from './helpers';
import SETTINGS from './settings';
import { NotijsPromise } from './index';

import loadingSVG from './svgs/loading.svg';
import successSVG from './svgs/success.svg';
import errorSVG from './svgs/error.svg';

type State = 'error' | 'running' | 'stopped' | 'success';

export class Async extends Message {
  public $loader!: HTMLElement | HTMLImageElement;
  public state: State;
  protected endTransitionEventListener: EventListener;

  constructor(
    text: string,
    options: NotijsOptions,
    public promise: NotijsPromise,
  ) {
    super(text, options);
    this.promise = promise;
    this.state = 'stopped';
    this.endTransitionEventListener = () => this.destroy();
  }

  public async render() {
    this.init();
    this.$loader = Helper.setDOM(
      'img',
      { ...SETTINGS.styles.icon },
      { src: loadingSVG, alt: 'Loading...' },
    );
    this.$message.addEventListener(
      'transitionend',
      this.endTransitionEventListener,
    );

    return await this.exec();
  }

  private async exec() {
    try {
      this.setState('running');
      const response = await this.promise.fn();
      this.setState('success', response);
      return response;
    } catch (error) {
      this.setState('error');
      return error;
    }
  }

  private setState(currentState: State, response?: any) {
    this.state = currentState;
    const txt = this.$message.getElementsByTagName('span')[0];

    switch (this.state) {
      case 'error':
        this.$loader.classList.remove('notijs_rotate');
        this.$loader.setAttribute('src', errorSVG);
        txt.textContent = this.promise.error;
        setTimeout(() => this.animate('out'), this.options.duration);
        break;

      case 'running':
        this.$loader.classList.add('notijs_rotate');
        this.$message.append(this.$loader);
        break;

      case 'success':
        this.$loader.classList.remove('notijs_rotate');

        this.$loader.setAttribute('src', successSVG);
        txt.textContent = this.promise.success;
        setTimeout(() => this.animate('out'), this.options.duration);
        break;
      default:
        throw new Error();
    }
  }

  protected destroy() {
    if (this.$message.dataset.animation === 'out') {
      super.destroy();

      this.$message.removeEventListener(
        'transitionend',
        this.endTransitionEventListener,
      );
    }
  }
}
