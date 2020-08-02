## API Report File for "@remirror/extension-blockquote"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { ApplySchemaAttributes } from '@remirror/core';
import { CommandFunction } from '@remirror/core';
import { KeyBindings } from '@remirror/core';
import { NodeExtension } from '@remirror/core';
import { NodeExtensionSpec } from '@remirror/core';

// @public
export class BlockquoteExtension extends NodeExtension {
    // (undocumented)
    createCommands(): {
        toggleBlockquote: () => CommandFunction;
    };
    // (undocumented)
    createInputRules(): import("@remirror/pm/inputrules").InputRule<any>[];
    // (undocumented)
    createKeymap(): KeyBindings;
    // (undocumented)
    createNodeSpec(extra: ApplySchemaAttributes): NodeExtensionSpec;
    // (undocumented)
    get name(): "blockquote";
}


// (No @packageDocumentation comment for this package)

```