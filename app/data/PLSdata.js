function startInterval() {
  setInterval("plsData();", 5000);
}

// fetch XML data of PLS
function getXMLFile(path, callback) {
  let request = new XMLHttpRequest();
  request.open("GET", path);
  request.setRequestHeader("Content-Type", "text/xml");
  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
      callback(request.responseXML);
    }
  };
  request.send();
}

export function callData() {
  getXMLFile(
    "https://parken.amberg.de/wp-content/uploads/pls/pls.xml",
    function (xml) {
      //save XML data into array
      var data = xml.getElementsByTagName("Daten");
      var arr = [];
      for (var key in data) {
        arr.push([]);
        var nodes = data[key].childNodes;
        for (var ele in nodes) {
          if (nodes[ele]) {
            arr[key].push(nodes[ele]);
          }
        }
      }
      console.log(arr);
    }
  );
}
