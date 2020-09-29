import type { Messages } from '@lingui/core';

type EnMessages = Record<"bold.menu.icon.label" | "image.menu.icon.label" | "italic.menu.icon.label" | "static-menu.label", Messages[string]>;

export interface EnLocale {
  /**
   * The messages available for the `en` locale.
   */
  messages: EnMessages;
}

export const en: EnLocale = {"messages":{"bold.menu.icon.label":"Bold","image.menu.icon.label":"Image","italic.menu.icon.label":"Italic","static-menu.label":"Static menu"}};

export default en;
