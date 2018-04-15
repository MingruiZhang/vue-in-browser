import XMLFileReader from './fileReader';
import insertCSSToDOM from './insertCSS';
import path from 'path';
const vueCompiler = require('vue-template-compiler'); // For some reason the vue-template-compiler can't be imported?
/**
 * Fetch function to get a code's content
 * @param  {object} part - a parsed component represent content of a code block
 * @param  {string} fileDir - the directory name of the vue file path
 * @return {Promise.<string, error>} - Raw content string from either block's src import or code content
 */
const fetchRawContentPromise = (part, fileDir) => {
  if (!part) return Promise.resolve('') // (?)
  // If the code block have src defined, priorities use that
  return part.src ? XMLFileReader(path.resolve(fileDir, part.src)) : Promise.resolve(part.content);
}
/**
 * Helper funciton to turn the raw script string into string
 * @param  {object} part - a parsed component represent content of a code block
 * @return {Promise.<string, error>} - Raw content string from either block's src import or code content
 */
const scriptToFunction = raw => {
  // The hack is to change export statement to 'return' and call function constructor.
  return Function(raw.replace('export default', 'return').replace('module.exports =', 'return'));
}
/**
 * Core compile function
 * @param {sting} filePath - relative file path to .vue file
 * @return {Promise.<vueOption, error>} - generated vue option to construct new Vue instance
 */
export default filePath => {
  return XMLFileReader(filePath).then(rawFile => {
    const fileDir = path.dirname(filePath);
    const compiledParts = vueCompiler.parseComponent(rawFile, { pad: true });

    const compiledTemplatePromise = fetchRawContentPromise(compiledParts.template, fileDir).then(rawContent =>
      vueCompiler.compileToFunctions(rawContent)
    );
    const compiledScriptPromise = fetchRawContentPromise(compiledParts.script, fileDir).then(rawContent =>
      scriptToFunction(rawContent)
    );
    const compiledCSSPromiseArray = compiledParts.styles.map(style => fetchRawContentPromise(style, fileDir));

    return Promise.all([compiledTemplatePromise, compiledScriptPromise, ...compiledCSSPromiseArray]).then(
      ([processedTemplate, processedScript, ...processedCSSArray]) => {
        // CSS are inserted straight into HTML <head>
        insertCSSToDOM(processedCSSArray.join('\n'));
        // returned vue option contains data / render / staticRenderFns field
        return { ...processedTemplate, ...processedScript() };
      }
    );
  });
}
