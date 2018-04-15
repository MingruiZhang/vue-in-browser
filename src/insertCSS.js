/**
 * Create a <style type="text/css"> tag containing all css and insert to document <head>
 * @param  {string} rawCSS - The css string to be applied
 */
export default function insertCSS(rawCSS) {
  const scriptTag = document.createElement('style');
  scriptTag.setAttribute('type', 'text/css');
  scriptTag.textContent = rawCSS;
  document.getElementsByTagName('head')[0].appendChild(scriptTag);
}