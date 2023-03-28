import { crudeTokenizer } from '../utils/tokenizer';
import { AbstractTemplate } from './abstract-template';

export class Template extends AbstractTemplate {
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
