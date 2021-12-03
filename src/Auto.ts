import { Message } from './Message';
import { NotijsOptions } from './index';
import { STYLES } from './settings';

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
    this.setCSS('progress', STYLES.progress);

    this.$progress = this.setExtend(document.createElement('div'), this.extend?.progressbar || {});
    this.$progress.classList.add('notijs_progress');
    this.$message.appendChild(this.$progress);
    this.$message.addEventListener('transitionend', this.endTransitionEventListener);

    window.requestAnimationFrame(this.progressBar.bind(this));

    setTimeout(() => this.animate('out'), this.duration);
  }

  private progressBar(current_time_progress: number) {
    if (!this.start_time_progress) {
      this.start_time_progress = current_time_progress;
    }

    const elapsed = current_time_progress - this.start_time_progress;

    if (this.previous_time_progress !== current_time_progress) {
      const count = (elapsed / this.duration) * 99;
      this.$progress.style.width = `${count}%`;
    }

    if (elapsed < this.duration) {
      this.previous_time_progress = current_time_progress;
      window.requestAnimationFrame(this.progressBar.bind(this));
    }
  }

  protected destroy() {
    if (this.$message.dataset.animation === 'out') {
      super.destroy();

      this.$message.removeEventListener('transitionend', this.endTransitionEventListener);
    }
  }
}
