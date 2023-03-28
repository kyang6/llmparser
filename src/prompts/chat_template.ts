import { Message } from '../llms/types';
import { crudeTokenizer } from '../utils/tokenizer';

export class ChatTemplate {
  private template: Message[];

  constructor(template: Message[]) {
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
      let content = message.content;
      for (const [key, value] of Object.entries(replacements)) {
        content = content.replace(`{{${key}}}`, value);
      }
      return {
        ...message,
        content,
      };
    });

    return renderedTemplate;
  }
}
