import { Message } from './Message';
import { STYLES } from './settings';
import { NotijsOptions, NotijsPromise } from './index';
import loadingSVG from './svgs/loading.svg';
import successSVG from './svgs/success.svg';
import errorSVG from './svgs/error.svg';

type State = 'error' | 'running' | 'success';

export class Async extends Message {
  public $loader: HTMLImageElement;
  protected endTransitionEventListener: EventListener;

  constructor(text: string, options: NotijsOptions, public promise: NotijsPromise) {
    super(text, options);
    this.promise = promise;
    this.$loader = document.createElement('img');
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
    const txt = this.$message.getElementsByTagName('span')[0];

    switch (currentState) {
      case 'error':
        this.$loader.classList.remove('notijs_rotate');
        this.$loader.src = errorSVG;
        txt.textContent = this.promise.error;
        setTimeout(() => this.animate('out'), this.duration);
        break;

      case 'success':
        this.$loader.classList.remove('notijs_rotate');
        this.$loader.src = successSVG;
        txt.textContent = this.promise.success;
        setTimeout(() => this.animate('out'), this.duration);
        break;
      default:
        this.$loader.classList.add('notijs_rotate');
        this.$message.append(this.$loader);
    }
  }

  protected destroy() {
    if (this.$message.dataset.animation === 'out') {
      super.destroy();

      this.$message.removeEventListener('transitionend', this.endTransitionEventListener);
    }
  }
}
