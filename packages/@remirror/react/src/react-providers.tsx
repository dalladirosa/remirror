import type { CSSProperties, ElementType, ReactElement, ReactNode } from 'react';
import React, { useEffect } from 'react';

import { i18n as defaultI18n } from '@remirror/i18n';
import { RemirrorType } from '@remirror/react-utils';
import type { RemirrorThemeType } from '@remirror/theme';
import { createThemeVariables, themeStyles } from '@remirror/theme';

import { I18nContext } from './react-contexts';
import type { I18nContextProps } from './react-types';

export interface I18nProviderProps extends Partial<I18nContextProps> {
  children: ReactNode;
}

/**
 * A provider component for the remirror i18n helper library.
 *
 * This uses `@lingui/core` in the background. So please star and support the
 * project when you have a moment.
 */
export const I18nProvider = (props: I18nProviderProps): ReactElement<I18nProviderProps> => {
  const { i18n = defaultI18n, locale = 'en', supportedLocales, children } = props;

  useEffect(() => {
    i18n.activate(locale, supportedLocales ?? [locale]);
  }, [i18n, locale, supportedLocales]);

  return (
    <I18nContext.Provider value={{ i18n, locale, supportedLocales }}>
      {children}
    </I18nContext.Provider>
  );
};

I18nProvider.$$remirrorType = RemirrorType.I18nProvider;

export interface ThemeProviderProps {
  /**
   * The theme to customise the look and feel of your remirror editor.
   */
  theme: RemirrorThemeType;

  /**
   * The custom component to use for rendering this editor.
   *
   * @default 'div'
   */
  as?: ElementType<{ style?: CSSProperties; className?: string }>;

  children: ReactNode;
}

/**
 * This the `ThemeProvider`. Wrap your editor with it to customise the theming
 * of content within your editor.
 *
 * Please be aware that this wraps your component in an extra dom layer.
 */
export const ThemeProvider = (props: ThemeProviderProps): ReactElement<ThemeProviderProps> => {
  const { theme, children, as: Component = 'div' } = props;

  return (
    <Component style={createThemeVariables(theme).styles} className={themeStyles}>
      {children}
    </Component>
  );
};

ThemeProvider.$$remirrorType = RemirrorType.ThemeProvider;
