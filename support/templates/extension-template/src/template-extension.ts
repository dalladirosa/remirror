import { extensionDecorator, PlainExtension } from '@remirror/core';

export interface TemplateOptions {}

/**
 * TEMPLATE_DESCRIPTION
 */
@extensionDecorator<TemplateOptions>({})
export class TemplateExtension extends PlainExtension<TemplateOptions> {
  get name() {
    return 'template' as const;
  }
}
