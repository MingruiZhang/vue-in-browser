import Vue from 'vue';
import Compiler from './compiler';
/**
 * Main function to create the Vue instance from compiled .vue file.
 * Attach it to the window scope so can be used anywhere
 * @param  {string} filePath - the path to the .vue file
 * @param  {string} elementId - the element id in DOM to render the vue component
 */
window.loadVueComponent = (filePath, elementId) => {
  // Compile vue option from file path and create vue instance
  return Compiler(filePath).then(option => {
    new Vue({
      el: elementId,
      render: function(createElement) {
        return createElement(option);
      }
    });
  });
};