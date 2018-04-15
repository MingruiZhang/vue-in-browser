import path from 'path';
import Compiler from '../src/compiler';

const vueCompiler = require('vue-template-compiler');

jest.mock('../src/insertCSS', () => jest.fn());
// Mock the browser readFile api function with Node file system readFile api
jest.mock('../src/fileReader', () => {
  const fs = require('fs');
  return filePath => {
    return Promise.resolve(fs.readFileSync(filePath, 'utf8'));
  };
});

const assertRender = (options, template) => {
  const expectedCompile = vueCompiler.compileToFunctions(template);
  expect(expectedCompile.render.toString()).toEqual(options.render.toString());
};

describe('vue in browser', () => {
  let insertCSSFunc = require('../src/insertCSS');

  test('correctly render basic .vue component ', done => {
    Compiler(path.resolve(__dirname, './fixtures/1-basic/basic.vue')).then(vueOptions => {
      expect(vueOptions.data()).toEqual({ msg: 'Hello world!' });
      assertRender(vueOptions, '<div class="example">{{ msg }}</div>');
      expect(insertCSSFunc.mock.calls[0]).toEqual(['.example {\n  color: red;\n}']);
      done();
    });
  });

  test('correctly render .vue component when import template/js/css', done => {
    Compiler(path.resolve(__dirname, './fixtures/2-src-import/src-import.vue')).then(vueOptions => {
      expect(vueOptions.data()).toEqual({
        items: [{ id: 1, name: 'cat' }, { id: 2, name: 'dog' }, { id: 3, name: 'sheep' }]
      });
      assertRender(
        vueOptions,
        '<ul class="blue">\n  <li v-for="item in items" :key="item.id">\n\t\t{{ item.name }}\n\t</li>\n</ul>'
      );
      expect(insertCSSFunc.mock.calls[1]).toEqual(['.pink {\n  color: pink;\n}']);
      done();
    });
  });
});
