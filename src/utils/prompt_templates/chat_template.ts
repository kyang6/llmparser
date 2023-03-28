import { Message } from '../../llms/types';
import { crudeTokenizer } from '../tokenizer';
import { TemplateBase } from './base';

export class ChatTemplate extends TemplateBase {
  protected template: Message[];

  constructor(template: Message[]) {
    super();
    this.template = template;
  }

  public numChars(): number {
    return this.template.reduce(
      (acc, message) => acc + message.content.length,
      0
    );
  }

  public numTokens(): number {
    return this.template.reduce(
      (acc, message) => acc + crudeTokenizer(message.content),
      0
    );
  }

  public render(replacements: Record<string, string>): Message[] {
    // go through every message and replace the placeholders
    const renderedTemplate = this.template.map(message => {
      const content = this.replacePlaceholders(message.content, replacements);
      return {
        ...message,
        content,
      };
    });

    return renderedTemplate;
  }
}
