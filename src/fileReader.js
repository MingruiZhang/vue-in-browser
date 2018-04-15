/**
 * A browser version of Node file system's readFile https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
 * @param  {string} filePath - The file path to read file
 * @return {Promise.<string, error>} - The raw content string of the file
 */
export default function XMLFileReader(filePath) {
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