---
slug: remirror-1.0.0-beta
title: Beta Release
author: Ifiok Jr.
author_title: Remirror Maintainer
author_url: https://github.com/ifiokjr
author_image_url: https://avatars1.githubusercontent.com/u/1160934?v=4
tags: [remirror, beta]
---

I've thought about it for a while now. How do you introduce a breaking change?

Here's what's changing in the first beta release.

- Remove `Presets` completely from the library. In their place a function that returns a list of `Extension`s. They were clunky, difficult to use and provided little to no value. The change reduces the bundle size quite significantly.
- `remirror` includes all the core imports from the library as well as extensions and presets. It doesn't include framework specific exports.
- `remirror/react` now includes all the react exports from `remirror/react-hooks`, `remirror/react-utils`, `remirror/preset-react`.
- `remirror/extensions` now includes all the presets and extension libraries.
- Renamed a lot of exports.
- Remove `@remirror/showcase`
- Remove `@remirror/react-social`
- Remove `@remirror/react-wysiwyg`
- Rename `useRemirror` -> `useRemirrorContext`
- Replace `useManager` with better `useRemirror` which provides a lot more functionality.
- Rename `preset-table` to `extension-tables`
- Rename `preset-list` to `extension-lists`. `ListPreset` is now `BulletListExtension` and `OrderListExtension`.
- Create decorations extension
- Add markdown support via markdown extension
- Add media extension and media placeholder extension
- Add support for media placeholder
- Support handlers used as reducers
- Deprecate `tags` property on extension and use the `createTags` which is a method instead.
- Add `onApplyState` and `onInitState` lifecycle methods.
- Add `onApplyTransaction` method.

### `ExtensionStore`

- Rename plugin update method in the store from `updateExtensionPlugins`.
- Rename `addOrReplacePlugins` to `updatePlugins` in `ExtensionStore`.
- Remove `reconfigureStatePlugins` and auto apply it for all plugin updating methods.

A hugely improved API for `@remirror/react`.

```tsx
import React from 'react';
import { BoldExtension, ItalicExtension } from 'remirror';
import { Remirror, useRemirror } from 'remirror/react';

const Editor = () => {
  const { manager, onChange } = useRemirror({
    extensions: () => [new BoldExtension(), new ItalicExtension()],
  });

  return <Remirror manager={manager} onChange={onChange} />;
};
```

When no children are provided to the

`useRemirror` now has a different meaning and replaces the previous `useManager` which was overly focused on implementation details.

Per library expected changes.

### `@remirror/preset-table`

With the new support for extensions which act as parents to other extensions the table extension has now become a preset extension. It is no longer needed and has been renames to it's initial name
