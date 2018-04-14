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