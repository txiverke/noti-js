import { Message } from './Message';
import { NotijsOptions } from './index';
import * as Helper from './helpers';

export class Auto extends Message {
  $progress!: HTMLElement;
  start_time_progress!: number;
  previous_time_progress!: number;

  protected endTransitionEventListener: EventListener;

  constructor(text: string, options: NotijsOptions) {
    super(text, options);
    this.endTransitionEventListener = () => this.destroy();
  }

  public render() {
    this.init();

    this.$progress = document.createElement('div');
    this.$progress.classList.add('notijs_progress');
    this.$progress = Helper.setDOM(this.$progress, this.options?.extend?.progressbar);

    this.$message.addEventListener('transitionend', this.endTransitionEventListener);
    this.$message.appendChild(this.$progress);

    window.requestAnimationFrame(this.progress.bind(this));

    setTimeout(() => this.animate('out'), this.options.duration);
  }

  private progress(current_time_progress: number) {
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
      window.requestAnimationFrame(this.progress.bind(this));
    }
  }

  protected destroy() {
    if (this.$message.dataset.animation === 'out') {
      super.destroy();

      this.$message.removeEventListener('transitionend', this.endTransitionEventListener);
    }
  }
}
