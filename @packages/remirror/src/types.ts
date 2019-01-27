import { InputRule } from 'prosemirror-inputrules';
import {
  Mark,
  MarkSpec,
  MarkType,
  Node as PMNode,
  NodeSpec,
  NodeType,
  Schema,
} from 'prosemirror-model';
import {
  EditorState,
  Plugin as PMPlugin,
  PluginKey,
  Selection,
  Transaction,
} from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Omit, PlainObject } from 'simplytyped';
import { RemirrorCustomStyles } from './components';

/**
 * Used to apply the Prosemirror transaction to the current EditorState.
 */
export type DispatchFunction = (tr: Transaction) => void;

/**
 * This function encapsulate an editing action.
 * A command function takes an editor state and optionally a dispatch function that it can use to dispatch a transaction.
 * It should return a boolean that indicates whether it could perform any action.
 *
 * When no dispatch callback is passed, the command should do a 'dry run', determining whether it is applicable,
 * but not actually doing anything
 */
export type CommandFunction = (state: EditorState<any>, dispatch?: DispatchFunction) => boolean;

/**
 * A map of keyboard bindings and their corresponding command functions (a.k.a editing actions).
 */
export type KeyboardBindings = Record<string, CommandFunction>;

/* The following is an alternative type definition for the built in Prosemirror definition
The current Prosemirror types were causing me some problems */

type DOMOutputSpecPos1 = DOMOutputSpecPosX | { [attr: string]: string };
type DOMOutputSpecPosX = string | 0 | Node;
export type DOMOutputSpec =
  | DOMOutputSpecPosX
  | [
      string,
      DOMOutputSpecPos1?,
      DOMOutputSpecPosX?,
      DOMOutputSpecPosX?,
      DOMOutputSpecPosX?,
      DOMOutputSpecPosX?,
      DOMOutputSpecPosX?,
      DOMOutputSpecPosX?,
      DOMOutputSpecPosX?,
      DOMOutputSpecPosX?,
      DOMOutputSpecPosX?
    ];

export type NodeExtensionSpecification = Omit<NodeSpec, 'toDOM'> & {
  toDOM?: ((node: ProsemirrorNode) => DOMOutputSpec) | null;
};

export type MarkExtensionSpecification = Omit<MarkSpec, 'toDOM'> & {
  toDOM?: ((mark: Mark) => DOMOutputSpec) | null;
};

/**
 * Alias type for better readability throughout the codebase.
 */
export type ProsemirrorNode = PMNode;
export type ProsemirrorPlugin = PMPlugin;
export type EditorSchema = Schema<string, string>;

export interface IExtension {
  readonly name: string;
  readonly pluginKey: PluginKey;
  readonly type: ExtensionType;
  readonly defaultOptions?: Record<string, any>;
  readonly plugins?: ProsemirrorPlugin[];
  commands?(params: SchemaParams): FlexibleConfig<ExtensionCommandFunction>;
  pasteRules(params: SchemaParams): ProsemirrorPlugin[];
  inputRules(params: SchemaParams): InputRule[];
  keys(params: SchemaParams): KeyboardBindings;
  active(params: SchemaWithStateParams): FlexibleConfig<ExtensionActiveFunction>;
  enabled(params: SchemaWithStateParams): FlexibleConfig<ExtensionEnabledFunction>;
}

export interface SchemaParams {
  schema: Schema;
}

export interface SchemaWithStateParams extends SchemaParams {
  getEditorState: () => EditorState;
}

export type FlexibleConfig<GFunc> = GFunc | GFunc[] | Record<string, GFunc | GFunc[]>;

export type ExtensionCommandFunction = (attrs?: Attrs) => CommandFunction;
export type ExtensionActiveFunction = (attrs?: Attrs) => boolean;
export type ExtensionEnabledFunction = () => boolean;

export interface SchemaTypeParams<GSchemaType> extends SchemaParams {
  type: GSchemaType;
}

export type SchemaNodeTypeParams = SchemaTypeParams<NodeType<EditorSchema>>;
export type SchemaMarkTypeParams = SchemaTypeParams<MarkType<EditorSchema>>;

export interface CommandParams extends SchemaParams {
  view: EditorView;
  isEditable: () => boolean;
}

export interface ISharedExtension<GSchemaType extends NodeType | MarkType> extends IExtension {
  readonly view: any;
  commands?(params: SchemaTypeParams<GSchemaType>): FlexibleConfig<ExtensionCommandFunction>;
  pasteRules(params: SchemaTypeParams<GSchemaType>): ProsemirrorPlugin[];
  inputRules(params: SchemaTypeParams<GSchemaType>): InputRule[];
  keys(params: SchemaTypeParams<GSchemaType>): KeyboardBindings;
}

export interface INodeExtension extends ISharedExtension<NodeType<EditorSchema>> {
  readonly type: ExtensionType.NODE;
  schema: NodeExtensionSpecification;
}

export interface IMarkExtension extends ISharedExtension<MarkType<EditorSchema>> {
  readonly type: ExtensionType.MARK;
  schema: MarkExtensionSpecification;
}

// export interface ActiveDocumentElements {}

export interface SuggestionsRange {
  from: number;
  to: number;
}

export type Attrs = Record<string, string>;

/* Utility Types */

export type Key<GRecord> = keyof GRecord;
export type Value<GRecord> = GRecord[Key<GRecord>];

export interface Position {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export interface ShouldRenderMenuProps {
  offsetWidth: number;
  offsetHeight: number;
  selection: Selection;
  emptySelection: boolean;
}

export interface RawMenuPositionData extends Position, ShouldRenderMenuProps {
  windowTop: number;
  windowLeft: number;
  windowBottom: number;
  windowRight: number;
  nonTextNode: Pick<HTMLElement, 'offsetWidth' | 'offsetHeight' | 'offsetLeft' | 'offsetTop'>;
}

export type OffsetCalculatorMethod = (props: RawMenuPositionData) => number;
export type ShouldRenderMenu = (props: ShouldRenderMenuProps) => boolean;
export interface OffsetCalculator {
  top?: OffsetCalculatorMethod;
  left?: OffsetCalculatorMethod;
  right?: OffsetCalculatorMethod;
  bottom?: OffsetCalculatorMethod;
}

export type ElementUnion = Value<HTMLElementTagNameMap>;

export interface ActionMethods {
  run(): void;
  isActive(): boolean;
  isEnabled(): boolean;
}

export type RemirrorActions<GKeys extends string = string> = Record<GKeys, ActionMethods>;

/**
 * Marks are categorised into different groups. One motivation for this was to allow the `code` mark
 * to exclude other marks, without needing to explicitly name them. Explicit naming requires the
 * named mark to exist in the schema. This is undesirable because we want to construct different
 * schemas that have different sets of nodes/marks.
 */
export enum MarkGroup {
  FONT_STYLE = 'fontStyle',
  SEARCH_QUERY = 'searchQuery',
  LINK = 'link',
  COLOR = 'color',
  ALIGNMENT = 'alignment',
  INDENTATION = 'indentation',
}

export enum ExtensionType {
  NODE = 'node',
  MARK = 'mark',
  EXTENSION = 'extension',
}

export interface GetMenuPropsConfig<GRefKey extends string = 'ref'>
  extends BaseGetterConfig<GRefKey> {
  offset?: OffsetCalculator;
  shouldRender?: ShouldRenderMenu;
  offscreenPosition?: Partial<Position>;
  name: string;
}

export interface BaseGetterConfig<GRefKey extends string = 'ref'> {
  refKey?: GRefKey;
}

export interface GetRootPropsConfig<GRefKey extends string = 'ref'>
  extends BaseGetterConfig<GRefKey>,
    PlainObject {}

export interface InjectedRemirrorProps {
  /**
   * The prosemirror view
   */
  view: EditorView<EditorSchema>;
  actions: RemirrorActions;
  getMarkAttr(type: string): Record<string, string>;
  clearContent(triggerOnChange?: boolean): void;
  setContent(content: string | ObjectNode, triggerOnChange?: boolean): void;

  getRootProps<GRefKey extends string = 'ref'>(
    options?: GetRootPropsConfig<GRefKey>,
  ): PlainObject & { [P in Exclude<GRefKey, 'children' | 'key'>]: React.Ref<any> };
  getMenuProps<GRefKey extends string = 'ref'>(
    options: GetMenuPropsConfig<GRefKey>,
  ): { position: Position; rawData: RawMenuPositionData | null; offscreen: boolean } & {
    [P in Exclude<GRefKey, 'children' | 'key' | 'position' | 'rawData' | 'offscreen'>]: React.Ref<
      any
    >
  };
}

export type RenderPropFunction = (params: InjectedRemirrorProps) => JSX.Element;

export interface RemirrorEventListenerParams {
  state: EditorState<EditorSchema>;
  view: EditorView<EditorSchema>;
  getHTML(): string;
  getText(lineBreakDivider?: string): string;
  getJSON(): ObjectNode;
  getDocJSON(): ObjectNode;
}

export type RemirrorEventListener = (params: RemirrorEventListenerParams) => void;
export type AttributePropFunction = (params: RemirrorEventListenerParams) => Record<string, string>;

export interface RemirrorProps {
  autoFocus?: boolean;
  placeholder?: string;
  onChange?: RemirrorEventListener;
  onFocus?: RemirrorEventListener;
  onBlur?: RemirrorEventListener;
  onFirstRender?: RemirrorEventListener;
  children: RenderPropFunction;
  dispatchTransaction?: ((tr: Transaction<EditorSchema>) => void) | null;
  initialContent: ObjectNode | string;
  attributes: Record<string, string> | AttributePropFunction;
  editable: boolean;
  label?: string;
  useBuiltInExtensions?: boolean;
  extensions: IExtension[];
  styles?: Partial<RemirrorCustomStyles> | null;
}

export type Literal = string | number | boolean | undefined | null | void | {};

export interface ObjectMark {
  type: string;
  attrs?: Record<string, string | null>;
}

export interface ObjectNode {
  type: string;
  marks?: Array<ObjectMark | string>;
  text?: string;
  content?: ObjectNode[];
  attrs?: Record<string, Literal | object>;
}
