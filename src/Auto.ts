import { Message } from './Message';
import { INotifierOptions } from './index';
import * as Helper from './helpers';
import DEFAULTS from './defaults.json';

export class Auto extends Message {
  $progress: HTMLElement;
  start_time_progress: number | null;
  previous_time_progress: number | null;

  protected endTransitionEventListener: EventListener;

  constructor(text: string, options: Partial<INotifierOptions>) {
    super(text, options);

    this.$progress = Helper.setDOM(document.createElement('div'), {
      ...DEFAULTS.styles.progress,
    });

    this.start_time_progress = null;
    this.previous_time_progress = null;

    this.endTransitionEventListener = () => this.destroy();
  }

  render() {
    this.init();

    this.$message.addEventListener(
      'transitionend',
      this.endTransitionEventListener,
    );

    this.$message.appendChild(this.$progress);
    window.requestAnimationFrame(this.setProgress.bind(this));

    setTimeout(() => this.animate('out'), this.options.duration);
  }

  setProgress(current_time_progress: number) {
    if (!this.start_time_progress) {
      this.start_time_progress = current_time_progress;
    }

    const elapsed = current_time_progress - this.start_time_progress;

    if (this.previous_time_progress !== current_time_progress) {
      const count = (elapsed / this.options.duration) * 99;
      this.$progress.style.width = `${count}%`;
    }

    if (elapsed < this.options.duration) {
      this.previous_time_progress = current_time_progress;
      window.requestAnimationFrame(this.setProgress.bind(this));
    }
  }

  destroy() {
    if (this.$message.dataset.animation === 'out') {
      super.destroy();

      this.$message.removeEventListener(
        'transitionend',
        this.endTransitionEventListener,
      );
    }
  }
}
