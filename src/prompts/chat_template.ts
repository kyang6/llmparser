import { Message } from '../llms/types';

export class ChatTemplate {
  private template: Message[];

  constructor(template: Message[]) {
    this.template = template;
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
