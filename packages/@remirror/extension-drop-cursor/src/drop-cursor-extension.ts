import {
  CreateExtensionPlugin,
  Dispose,
  EditorView,
  entries,
  extensionDecorator,
  isElementDomNode,
  isNumber,
  object,
  PlainExtension,
  ResolvedPos,
  StateUpdateLifecycleParameter,
} from '@remirror/core';
import { dropPoint } from '@remirror/pm/transform';
import { Decoration, DecorationSet } from '@remirror/pm/view';

interface CreateCursorElementParameter {
  type: 'block' | 'inline';
  view: EditorView;
  getPos: () => number;
  /**
   * The drop cursor class which is added to the drop cursor widget.
   *
   * @default 'drop-cursor'
   */
  dropCursorClass: string;
}

export interface DropCursorOptions {
  /**
   * The class name added to the block node which is directly before the drop
   * cursor.
   *
   * @default 'before-drop-cursor'
   */
  beforeDropCursorClass?: string;

  /**
   * The class name added to the block node which is directly after the drop
   * cursor.
   *
   * @default 'after-drop-cursor'
   */
  afterDropCursorClass?: string;

  /**
   * The class name added to the block node which contains the drop cursor.
   *
   * @default 'contains-drop-cursor'
   */
  containsDropCursorClass?: string;

  /**
   * The drop cursor class which is added to the drop cursor widget.
   *
   * @default 'drop-cursor'
   */
  dropCursorClass?: string;

  /**
   * Create the HTML element for the drop cursor.
   */
  createCursorElement?: (parameter: CreateCursorElementParameter) => HTMLElement;
}

/**
 * Create a plugin that, when added to a ProseMirror instance,
 * causes a widget decoration to show up at the drop position when something
 * is dragged over the editor.
 *
 * @builtin
 */
@extensionDecorator<DropCursorOptions>({
  defaultOptions: {
    afterDropCursorClass: 'after-drop-cursor',
    beforeDropCursorClass: 'before-drop-cursor',
    containsDropCursorClass: 'contains-drop-cursor',
    dropCursorClass: 'drop-cursor',
    createCursorElement,
  },
})
export class DropCursorExtension extends PlainExtension<DropCursorOptions> {
  get name() {
    return 'dropCursor' as const;
  }

  /** The current cursor position if it is valid. */
  #cursorPosition?: number = undefined;

  /**
   * The decoration set.
   */
  #decorationSet = DecorationSet.empty;

  /** The currently active timeout */
  #timeout?: number;

  /**
   * Set up the handlers once the view is available.
   */
  onView(view: EditorView): Dispose | void {
    const element = view.dom;

    if (!isElementDomNode(element)) {
      return;
    }

    const handlers = {
      dragover: this.dragover.bind(this),
      dragend: this.dragend.bind(this),
      drop: this.drop.bind(this),
      dragleave: this.dragleave.bind(this),
    };

    element.addEventListener('dragover', handlers.dragover);
    element.addEventListener('dragend', handlers.dragend);
    element.addEventListener('drop', handlers.drop);
    element.addEventListener('dragleave', handlers.dragleave);

    return () => {
      // Remove the event handlers.
      for (const [event, handler] of entries(handlers)) {
        element.removeEventListener(event, handler);
      }
    };
  }

  /**
   * Update the elements if an active cursor is present while the state is
   * updating.
   */
  onStateUpdate(parameter: StateUpdateLifecycleParameter): void {
    const { previousState, state } = parameter;

    if (isNumber(this.#cursorPosition) && !state.doc.eq(previousState.doc)) {
      // Update the cursor when the cursor is active and the doc has changed.
      // This takes care of updates that might be happening while dragging over
      // the editor.
      this.updateCursor();
    }
  }

  /** Update the cursor */
  private updateCursor() {}

  /**
   * Remove the active overlay after the timeout.
   */
  private scheduleRemoval(timeout: number) {
    clearTimeout(this.#timeout);
    this.#timeout = (setTimeout(() => this.setCursor(), timeout) as unknown) as number;
  }

  /**
   * Create elements.
   */
  private createElements() {}

  /**
   * Set the cursor for the dragover action.
   */
  private setCursor(pos?: number) {
    if (pos === this.#cursorPosition) {
      return;
    }

    // Update the position.
    this.#cursorPosition = pos;

    // this.#cursorDecoration?.spec.

    if (pos === undefined) {
      // this.#cursorElement?.remove();
      // this.#cursorElement = undefined;
      return;
    }

    this.updateCursor();
  }

  private dragover(event: DragEvent) {
    if (!this.editorView.editable) {
      return;
    }

    const pos = this.editorView.posAtCoords({ left: event.clientX, top: event.clientY });

    if (pos) {
      let target = pos.pos;

      if (this.editorView.dragging && this.editorView.dragging.slice) {
        target = dropPoint(this.editorView.state.doc, target, this.editorView.dragging.slice);

        if (target == null) {
          target = pos.pos;
        }
      }

      this.setCursor(target);
      this.scheduleRemoval(5000);
    }
  }

  private dragend(_: DragEvent) {
    this.scheduleRemoval(20);
  }

  private drop(event: DragEvent) {
    this.scheduleRemoval(20);
  }

  private dragleave(event: DragEvent) {
    if (event.target == this.editorView.dom || !this.editorView.dom.contains(event.relatedTarget)) {
      this.setCursor(null);
    }
  }

  /**
   * Create an inline decoration for the document which is rendered when the cursor position
   * is within a text block.
   */
  private createInlineDecoration($pos: ResolvedPos): Decoration[] {
    const decorations: Decoration[] = [];

    const dropCursor = Decoration.widget($pos.pos, this.inlineElement, {
      key: 'drop-cursor-inline',
    });
    decorations.push(dropCursor);

    return decorations;
  }
}

/**
 * The default cursor element creator.
 */
function createCursorElement(parameter: CreateCursorElementParameter) {
  const { type, dropCursorClass } = parameter;
  const element = type === 'block' ? document.createElement('div') : document.createElement('span');
  element.classList.add(dropCursorClass);

  return element;
}

interface Elements {
  /**
   * The created cursor element.
   */
  cursor: HTMLElement;

  /**
   * The element for the node after the drop cursor.
   */
  after?: HTMLElement;

  /**
   * The element for the block node before the drop cursor.
   */
  before?: HTMLElement;

  /**
   * The element for the block node which contains the current cursor.
   */
  contains?: HTMLElement;
}

type CustomEventMap = Pick<DocumentEventMap, 'dragover' | 'dragend' | 'drop' | 'dragleave'>;

type Handlers = { [Key in keyof CustomEventMap]: (event: CustomEventMap[Key]) => void };

declare global {
  namespace Remirror {
    interface AllExtensions {
      dropCursor: DropCursorExtension;
    }
  }
}
