import { crudeTokenizer } from '../tokenizer';
import { TemplateBase } from './base';

export class TextTemplate extends TemplateBase {
  protected template: string;

  constructor(template: string) {
    super();
    this.template = template;
  }

  public numChars(): number {
    return this.template.length;
  }

  public numTokens(): number {
    return crudeTokenizer(this.template);
  }

  public render(replacements: Record<string, string>): string {
    return this.replacePlaceholders(this.template, replacements);
  }
}
