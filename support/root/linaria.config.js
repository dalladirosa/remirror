const { kebabCase } = require('case-anything');

/**
 * @typedef { Object } StrictOptions
 * @property { ((hash: string, title: string) => string) | string | undefined } classNameSlug
 * @property { boolean } displayName
 * @property { boolean } evaluate
 * @property { RegExp | undefined } ignore
 * @property { TransformOptions} babelOptions
 * @property { Array<{ test?: RegExp | ((path: string) => boolean); action: Evaluator | 'ignore' | string}> } rules
 */

/**
 * @type {StrictOptions}
 */
const config = {
  displayName: true,
  classNameSlug: (_hash, title) => {
    return `remirror-${kebabCase(title.replace(/(?:Styles?|Component)$/g, ''))}`;
  },
  babelOptions: require('../base.babel'),
  rules: [
    {
      action: require('linaria/evaluators').shaker,
    },
    {
      action: 'ignore',
      test: (modulePath) =>
        /node_modules/.test(modulePath) && !/node_modules\/(@?remirror)/.test(modulePath),
    },
  ],
};

module.exports = config;
