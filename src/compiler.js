// browserify src/index.js -o build/build.js -t [ babelify --presets [ stage-2 ] ]
const path = require('path');
const vueCompiler = require('vue-template-compiler');

window.compileVue = filePath => {
  // Save the file directory path to global scope so it can be reused later for block srcs
  window.__vuePath = path.dirname(filePath);
  return XMLFileReader(filePath).then(rawFile => {
    const compiledParts = vueCompiler.parseComponent(rawFile, { pad: true });

    const compiledTemplatePromise = fetchRawContentPromise(compiledParts.template).then(rawContent =>
      vueCompiler.compileToFunctions(rawContent)
    );
    const compiledScriptPromise = fetchRawContentPromise(compiledParts.script).then(rawContent =>
      scriptToFunction(rawContent)
    );
    const compiledCSSPromiseArray = compiledParts.styles.map(style => fetchRawContentPromise(style));

    return Promise.all([compiledTemplatePromise, compiledScriptPromise, ...compiledCSSPromiseArray]).then(
      ([processedTemplate, processedScript, ...processedCSSArray]) => {
        // CSS are inserted straight into HTML <head>
        insertCSSToDOMHead(processedCSSArray.join('\n'));
        return { ...processedTemplate, ...processedScript() };
      }
    );
  });
};

function XMLFileReader(filePath) {
  return new Promise(resolve => {
    const request = new XMLHttpRequest();
    request.open('GET', filePath, true);
    request.onreadystatechange = () => {
      if (request.readyState === 4 && (request.status === 200 || request.status == 0)) {
        resolve(request.responseText);
      }
    };
    request.send(null);
  });
}

function fetchRawContentPromise(part) {
  if (!part) {
    // eslint-disable-next-line no-console
    console.error('You should have <template>, <script> and <style> blocks in your .vue file');
  }
  // If the code block have src defined, priorities it
  return part.src ? XMLFileReader(path.resolve(window.__vuePath, part.src)) : Promise.resolve(part.content);
}

function insertCSSToDOMHead(rawCSS) {
  const scriptTag = document.createElement('style');
  scriptTag.setAttribute('type', 'text/css');
  scriptTag.textContent = rawCSS;
  document.getElementsByTagName('head')[0].appendChild(scriptTag);
}

function scriptToFunction(raw) {
  return Function(raw.replace('export default', 'return').replace('exports.default =', 'return'));
}
