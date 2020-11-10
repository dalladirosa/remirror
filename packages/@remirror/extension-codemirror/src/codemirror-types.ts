import type CodeMirror from 'codemirror';

export interface CodeMirrorOptions {
  /**
   * Configuration for the inner CodeMirror editor.
   *
   * @default undefined
   */
  config?: CodeMirror.EditorConfiguration;
}
