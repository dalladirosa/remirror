import type { AcceptUndefined, EditorState, Handler, Selection, Shape } from '@remirror/core-types';
import { isNodeSelection } from '@remirror/core-utils';
import { Decoration, DecorationSet } from '@remirror/pm/view';

import { extensionDecorator } from '../decorators';
import { PlainExtension } from '../extension';
import { CreateExtensionPlugin } from '../types';

export interface DecorationsOptions {
  /**
   * This setting is for adding a decoration to the selected text and can be
   * used to preserve the marker for the selection when the editor loses focus.
   *
   * @default 'selection'
   */
  persistentSelectionClass?: AcceptUndefined<string>;

  /**
   * Enable adding custom decorations to the editor via `extension.addHandler`.
   */
  decorations: Handler<(state: EditorState) => DecorationSet>;
}

/**
 * Simplify the process of adding decorations to the editor. All the decorations
 * added to the document this way are automatically tracked which allows for
 * custom components to be nested inside decorations.
 *
 * @builtin
 */
@extensionDecorator<DecorationsOptions>({
  defaultOptions: {
    persistentSelectionClass: 'selection',
  },
  handlerKeys: ['decorations'],
  handlerKeyOptions: {
    decorations: {
      reducer: {
        accumulator: (accumulated, latestValue, state) => {
          return accumulated.add(state.doc, latestValue.find());
        },
        getDefault: () => DecorationSet.empty,
      },
    },
  },
})
export class DecorationsExtension extends PlainExtension<DecorationsOptions> {
  get name() {
    return 'decorations' as const;
  }

  /**
   * Create the extension plugin for inserting decorations into the editor.
   */
  createPlugin(): CreateExtensionPlugin {
    return {
      props: {
        decorations: (state) => {
          let decorationSet = this.options.decorations(state);

          for (const extension of this.store.extensions) {
            // Skip this extension when method doesn't exist.
            if (!extension.createDecorations) {
              continue;
            }

            const decorations = extension.createDecorations(state).find();
            decorationSet = decorationSet.add(state.doc, decorations);
          }

          return decorationSet;
        },
      },
    };
  }

  /**
   * Add some decorations based on the provided settings.
   */
  createDecorations(state: EditorState): DecorationSet {
    // A container for the gathered decorations.
    let decorationSet = DecorationSet.empty;

    if (this.options.persistentSelectionClass) {
      // Add the selection decoration to the decorations array.
      decorationSet = generatePersistentSelectionDecorations(state, decorationSet, {
        class: this.options.persistentSelectionClass,
      });
    }

    return decorationSet;
  }
}

/**
 * Generate the persistent selection decoration for when the editor loses focus.
 */
function generatePersistentSelectionDecorations(
  state: EditorState,
  decorationSet: DecorationSet,
  attrs: { class: string },
): DecorationSet {
  const { selection, doc } = state;

  if (selection.empty) {
    return decorationSet;
  }

  const { from, to } = selection;
  const decoration = isNodeSelection(selection)
    ? Decoration.node(from, to, attrs)
    : Decoration.inline(from, to, attrs);

  return decorationSet.add(doc, [decoration]);
}

declare global {
  namespace Remirror {
    interface ExtensionCreatorMethods {
      /**
       * Create a decoration set which adds decorations to your editor. The
       * first parameter is the `EditorState`.
       *
       * This can be used in combination with the `onApplyState` handler which
       * can map the decoration.
       *
       * @param state - the editor state which was passed in.
       */
      createDecorations?(state: EditorState): DecorationSet;
    }

    interface AllExtensions {
      decorations: DecorationsExtension;
    }
  }
}
