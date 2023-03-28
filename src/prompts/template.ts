import { crudeTokenizer } from '../utils/tokenizer';

export class Template {
  private template: string;

  constructor(template: string) {
    this.template = template;
  }

  public numChars(): number {
    return this.template.length;
  }

  public numTokens(): number {
    return crudeTokenizer(this.template);
  }

  // Replaces placeholders in the template with the provided values.
  // The placeholders are specified in the format {{key}}.
  public render(replacements: Record<string, string>): string {
    let result = this.template;
    for (const key in replacements) {
      const value = replacements[key];
      // Replace all occurrences of the placeholder with the corresponding value.
      const placeholder = `{{${key}}}`;
      result = result.split(placeholder).join(value);
    }
    return result;
  }
}
