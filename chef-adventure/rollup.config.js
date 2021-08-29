import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import { readFileSync } from 'fs';
import yaml from 'yaml';

const header = readFileSync(`./src/config/annotations.js`)
  + '\n'
  + readFileSync('./src/config/header.js', 'utf-8')
  + '\n'
  + `/* This was bundled at [${new Date().toLocaleString()}]. */`
  + '\n';
const meta = yaml.parse(readFileSync('./src/config/meta.yaml', 'utf-8'));

export default [
  {
    input: 'src/index.js',
    output: [
      /*
      {
        file: `${__dirname}/js/plugins/${meta.name}.js`,
        name: meta.namespace,
        format: 'iife',
        sourcemap: false,
        plugins: [
        terser({
            format: {
              comments: false,
              preamble: header
            }
          })
        ]
      },
      */
      {
        // file: `${__dirname}/js/plugins/${meta.name}.debug.js`,
        file: `${__dirname}/js/plugins/${meta.name}.js`,
        name: meta.namespace,
        format: 'iife',
        // sourcemap: true,
        banner: header,
      }
    ],
    plugins: [
      babel(
        {
          "presets": ["@babel/preset-env"],
          babelHelpers: 'bundled'
        })
    ]
  }
];