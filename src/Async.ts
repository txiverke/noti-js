import { Message } from './Message';
import { NotijsOptions } from './index';

export class Async extends Message {
  constructor(
    text: string,
    options: NotijsOptions,
    public promise: () => Promise<any>,
  ) {
    super(text, options);
    this.promise = promise;
  }

  async render() {
    this.init();
    const response = await this.promise();
    this.$message.children[0].textContent = response;
    return response
  }
}
