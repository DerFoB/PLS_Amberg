import { XMLParser } from "fast-xml-parser";

function startInterval() {
  setInterval("plsData();", 5000);
}

export function fetchXMLData(path) {
  var parser = new XMLParser();

  fetch(path)
    .then((result) => result.text())
    .then(
      (result) => {
        let parsedObject = parser.parse(result);
        console.log(parsedObject);
      },
      (error) => {
        console.log(error);
      }
    );
}
