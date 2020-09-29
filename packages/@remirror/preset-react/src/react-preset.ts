import { cx } from 'linaria';
import { Children, cloneElement } from 'react';

import { ExtensionPriority, isDocNodeEmpty, isString } from '@remirror/core';
import {
  PlaceholderExtension as DefaultPlaceholderExtension,
  PlaceholderOptions,
} from '@remirror/extension-placeholder';
import {
  ReactComponentExtension,
  ReactComponentOptions,
} from '@remirror/extension-react-component';
import { ReactSsrExtension, ReactSsrOptions, SsrTransformer } from '@remirror/extension-react-ssr';
import { getElementProps } from '@remirror/react-utils';

export interface ReactPresetOptions
  extends ReactSsrOptions,
    PlaceholderOptions,
    ReactComponentOptions {}

/**
 * This is identical to the placeholder extension except that it provides SSR
 * support.
 */
export class ReactPlaceholderExtension extends DefaultPlaceholderExtension {
  get name() {
    // This is because of a problem with extending extensions. The name constant
    // can't be changed without a forced cast
    return 'reactPlaceholder' as 'placeholder';
  }

  createSSRTransformer(): SsrTransformer {
    return (element: JSX.Element, state) => {
      state = state ?? this.store.getState();

      const { emptyNodeClass, placeholder } = this.options;
      const { children } = getElementProps(element);

      if (Children.count(children) > 1 || !isDocNodeEmpty(state.doc)) {
        return element;
      }

      const properties = getElementProps(children);
      return cloneElement(
        element,
        {},
        cloneElement(children, {
          placeholder,
          className: cx(isString(properties.className) && properties.className, emptyNodeClass),
          'data-placeholder': placeholder,
        }),
      );
    };
  }
}

const DEFAULT_OPTIONS = {
  ...ReactSsrExtension.defaultOptions,
  ...ReactPlaceholderExtension.defaultOptions,
  ...ReactComponentExtension.defaultOptions,
};

/**
 * This is the `ReactPreset which provides support for SSR, Placeholders and
 * React components for components when using **remirror** with React.
 */
export function reactPreset(options: ReactPresetOptions = {}): ReactPreset[] {
  options = { ...DEFAULT_OPTIONS, ...options };

  const {
    transformers,
    emptyNodeClass,
    placeholder,
    defaultBlockNode,
    defaultContentNode,
    defaultEnvironment,
    defaultInlineNode,
    nodeViewComponents,
  } = options;

  return [
    new ReactSsrExtension({ transformers }),
    new ReactPlaceholderExtension({
      emptyNodeClass,
      placeholder,
      priority: ExtensionPriority.Medium,
    }),
    new ReactComponentExtension({
      defaultBlockNode,
      defaultContentNode,
      defaultEnvironment,
      defaultInlineNode,
      nodeViewComponents,
    }),
  ];
}

export type ReactPreset = ReactSsrExtension | ReactPlaceholderExtension | ReactComponentExtension;
