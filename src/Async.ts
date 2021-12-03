import { Message } from './Message';
import { STYLES } from './settings';
import { NotijsOptions, NotijsPromise } from './index';
import loadingSVG from './svgs/loading.svg';
import successSVG from './svgs/success.svg';
import errorSVG from './svgs/error.svg';

type State = 'error' | 'running' | 'stopped' | 'success';

export class Async extends Message {
  public $loader: HTMLImageElement;
  public state: State;
  protected endTransitionEventListener: EventListener;

  constructor(text: string, options: NotijsOptions, public promise: NotijsPromise) {
    super(text, options);
    this.promise = promise;
    this.$loader = document.createElement('img');
    this.state = 'stopped';
    this.endTransitionEventListener = () => this.destroy();
  }

  public async render() {
    this.init();
    this.setCSS('animation', STYLES.animation);

    this.$loader.src = loadingSVG;
    this.$loader.alt = 'Loading...';
    this.$message.addEventListener('transitionend', this.endTransitionEventListener);

    return await this.exec();
  }

  private async exec() {
    try {
      this.setState('running');
      const response = await this.promise.fn();
      this.setState('success');
      return response;
    } catch (error) {
      this.setState('error');
      return error;
    }
  }

  private setState(currentState: State) {
    this.state = currentState;
    const txt = this.$message.getElementsByTagName('span')[0];

    switch (this.state) {
      case 'error':
        this.$loader.classList.remove('notijs_rotate');
        this.$loader.setAttribute('src', errorSVG);
        txt.textContent = this.promise.error;
        setTimeout(() => this.animate('out'), this.duration);
        break;

      case 'running':
        this.$loader.classList.add('notijs_rotate');
        this.$message.append(this.$loader);
        break;

      case 'success':
        this.$loader.classList.remove('notijs_rotate');

        this.$loader.setAttribute('src', successSVG);
        txt.textContent = this.promise.success;
        setTimeout(() => this.animate('out'), this.duration);
        break;
      default:
        throw new Error();
    }
  }

  protected destroy() {
    if (this.$message.dataset.animation === 'out') {
      super.destroy();

      this.$message.removeEventListener('transitionend', this.endTransitionEventListener);
    }
  }
}
