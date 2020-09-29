/** @type import('@docusaurus/plugin-content-docs/lib/types').Sidebars */
const sidebarConfig = {
  main: [
    'introduction',
    'installation',
    {
      type: 'category',
      label: 'Concepts',
      items: [
        'concepts/extension',
        'concepts/remirror-manager',
        'concepts/priority',
        'concepts/keymap',
        'concepts/error-handling',
        'concepts/extra-attributes',
      ],
    },
    {
      type: 'category',
      label: 'React',
      items: ['react/create-editor', 'react/controlled', 'react/ref', 'react/hooks'],
    },

    { type: 'category', label: 'Showcase', items: ['showcase/social'] },
    {
      type: 'category',
      label: 'Advanced',
      items: ['advanced/creating-extensions', 'advanced/naming-conventions'],
    },
    {
      type: 'category',
      label: 'Contributors',
      items: ['contributing', 'tooling', 'errors', 'projects'],
    },
    'faq',
  ],
};

module.exports = exports.default = sidebarConfig;
