import {
  CreateExtensionPlugin,
  extensionDecorator,
  ExtensionTag,
  PlainExtension,
} from '@remirror/core';

export interface MediaOptions {}

/**
 * Handle uploads and all things media related.
 */
@extensionDecorator<MediaOptions>({})
export class MediaExtension extends PlainExtension<MediaOptions> {
  get name() {
    return 'media' as const;
  }

  createTags() {
    return [ExtensionTag.Media];
  }

  createPlugin(): CreateExtensionPlugin {
    return {};
  }
}

declare global {
  namespace Remirror {
    interface AllExtensions {
      media: MediaExtension;
    }
  }
}
