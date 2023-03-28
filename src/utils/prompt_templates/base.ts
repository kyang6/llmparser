import { Message } from '../../llms/types';

/*
 * This is the base class for all templates. It is responsible for defining the interface
 * that all templates must implement.
 */
export abstract class TemplateBase {
  protected abstract template: string | Message[];
  abstract numChars(): number;
  abstract numTokens(): number;
  abstract render(replacements: Record<string, string>): string | Message[];

  protected replacePlaceholders(
    content: string,
    replacements: Record<string, string>
  ): string {
    let result = content;
    for (const key in replacements) {
      const value = replacements[key];
      // Replace all occurrences of the placeholder with the corresponding value.
      const placeholder = `{{${key}}}`;
      result = result.split(placeholder).join(value);
    }
    return result;
  }
}
