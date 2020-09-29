import {} from '@storybook/react';
import { Configuration } from 'webpack';
import WorkerPlugin from 'worker-plugin';

export default {
  stories: [
    './stories/*.stories.tsx',
    // '../../packages/@remirror/react/src/__stories__/*.stories.tsx',
    // '../../packages/@remirror/react-components/src/__stories__/*.stories.tsx',
  ],
  addons: ['@storybook/addon-actions', '@storybook/addon-links'],
  webpackFinal: async (config: Configuration): Promise<Configuration> => {
    config.module?.rules.push({
      test: /\.tsx?$/,
      use: [{ loader: require.resolve('babel-loader'), options: require('./.babelrc.js') }],
      exclude: [/node_modules/],
    });

    config.resolve?.extensions?.push('.ts', '.tsx');
    config.plugins?.push(new WorkerPlugin());

    return config;
  },
};
