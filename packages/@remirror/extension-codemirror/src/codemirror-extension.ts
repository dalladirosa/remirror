/**
 * Reference: https://codemirror.net/doc/manual.html#addon_loadmode
 */

import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/python/python';

import {
  ApplySchemaAttributes,
  CreatePluginReturn,
  EditorView,
  ExtensionTag,
  NodeExtension,
  NodeExtensionSpec,
  NodeViewMethod,
  ProsemirrorNode,
} from '@remirror/core';

import { CodeMirrorNodeView } from './codemirror-node-view';
import { createArrowHandlerPlugin } from './codemirror-plugin';
import type { CodeMirrorOptions } from './codemirror-types';

export class CodeMirrorExtension extends NodeExtension<CodeMirrorOptions> {
  get name() {
    return 'codeMirror' as const;
  }

  readonly tags = [ExtensionTag.BlockNode, ExtensionTag.Code];

  createNodeSpec(extra: ApplySchemaAttributes): NodeExtensionSpec {
    return {
      group: 'block',
      content: 'text*',
      marks: '',
      code: true,
      defining: true,
      attrs: {
        ...extra.defaults(),
        // language: { default: defaultLanguage },
      },
      parseDOM: [
        {
          tag: 'pre',
          // getAttrs: (dom: HTMLPreElement) => ({
          //     language: dom.getAttribute("data-language") || defaultLanguage,
          // }),
        },
      ],
      toDOM(node) {
        return ['pre', ['code', 0]];
      },
      isolating: true,
    };
  }

  createNodeViews(): NodeViewMethod {
    return (node: ProsemirrorNode, view: EditorView, getPos: boolean | (() => number)) => {
      return new CodeMirrorNodeView(node, view, getPos as () => number, this.options.config);
    };
  }

  createPlugin(): CreatePluginReturn {
    return createArrowHandlerPlugin();
  }
}
