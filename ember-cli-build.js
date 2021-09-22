'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const postcssImport = require('postcss-import');
const postcssPresetEnv = require('postcss-preset-env');
const tailwindcss = require('tailwindcss');
const purgecss = require('@fullhuman/postcss-purgecss');
const autoprefixer = require('autoprefixer');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    autoImport: {
      webpack: {
        node: {
          global: true,
        },
      },
      exclude: [
        '@fortawesome/fontawesome-common-types',
        'ember-cli-flash/services/flash-messages',
        'ember-concurrency-ts',
      ],
    },
    postcssOptions: {
      compile: {
        enabled: true,
        cacheInclude: [/.*\.css$/, /.*\.hbs$/, /tailwind\.config\.js$/],
        plugins: [
          postcssImport(),
          postcssPresetEnv({ stage: 0 }),
          tailwindcss('./tailwind.config.js'),
          purgecss({
            content: [
              './app/templates/**/*.hbs',
              './app/components/**/*.hbs',
              './app/components/**/*.js',
              './app/components/**/*.ts',
              './app/index.html',
            ],
            defaultExtractor: (content) => content.match(/[A-Za-z0-9-_:/]+/g) || [],
          }),
        ],
      },
      filter: {
        plugins: [autoprefixer],
      },
    },
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
