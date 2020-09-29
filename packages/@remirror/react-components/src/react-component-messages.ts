import { MessageDescriptor } from '@lingui/core';
import { defineMessage } from '@lingui/macro';

export const staticMenu: MessageDescriptor = defineMessage({
  id: 'static-menu.label',
  comment: 'The aria label for the static menu.',
  message: 'Static Menu',
});

const bold: MessageDescriptor = defineMessage({
  id: 'bold.menu.icon.label',
  comment: 'The label for the bold menu button.',
  message: 'Bold',
});

const italic: MessageDescriptor = defineMessage({
  id: 'italic.menu.icon.label',
  comment: 'The label for the italic menu button.',
  message: 'Italic',
});

const underline: MessageDescriptor = defineMessage({
  id: 'underline.menu.icon.label',
  comment: 'The label for the underline menu button.',
  message: 'Underline',
});

const h1: MessageDescriptor = defineMessage({
  id: 'h1.menu.icon.label',
  comment: 'The label for the h1 menu button.',
  message: 'Heading 1',
});

const h2: MessageDescriptor = defineMessage({
  id: 'h2.menu.icon.label',
  comment: 'The label for the h2 menu button.',
  message: 'Heading 2',
});

const h3: MessageDescriptor = defineMessage({
  id: 'h3.menu.icon.label',
  comment: 'The label for the h3 menu button.',
  message: 'Heading 3',
});

const image: MessageDescriptor = defineMessage({
  id: 'image.menu.icon.label',
  comment: 'The label for the image menu button.',
  message: 'Image',
});

const imageDialogLabel: MessageDescriptor = defineMessage({
  id: 'image.dialog.label',
  comment: 'The label for the image menu button.',
  message: 'Image',
});

const imageDialogSourceLabel: MessageDescriptor = defineMessage({
  id: 'image.dialog.source.label',
  comment: 'The label for the image url.',
  message: 'Image source',
});

const imageDialogDescriptionLabel: MessageDescriptor = defineMessage({
  id: 'image.dialog.description.label',
  comment: 'The image description label.',
  message: 'Image description',
});

const imageDialogDescriptionPlaceholder: MessageDescriptor = defineMessage({
  id: 'image.dialog.description.placeholder',
  comment: 'A placeholder for the description of the image that is being inserted.',
  message: 'Add a short description here.',
});

/**
 * The messages used within the component. They aren't currently being used.
 */
export const messages = {
  bold,
  italic,
  image,
  underline,
  staticMenu,
  h1,
  h2,
  h3,
  imageDialogLabel,
  imageDialogSourceLabel,
  imageDialogDescriptionLabel,
  imageDialogDescriptionPlaceholder,
};
