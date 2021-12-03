import { Message } from './Message';
import { NotijsOptions } from './index';
import { STYLES } from './settings';

export class Auto extends Message {
  $progress!: HTMLElement;
  startProgress!: number;
  previousProgress!: number;

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

  private progressBar(curProgress: number) {
    if (!this.startProgress) {
      this.startProgress = curProgress;
    }

    const elapsed = curProgress - this.startProgress;

    if (this.previousProgress !== curProgress) {
      const count = (elapsed / this.duration) * 99;
      this.$progress.style.width = `${count}%`;
    }

    if (elapsed < this.duration) {
      this.previousProgress = curProgress;
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
